var nodejs = (typeof window === 'undefined');
if(nodejs) {
  WebGL = require('../../index');
  document = WebGL.document();
  alert=console.log;
  window = document;

  //Read and eval library
  var fs=require('fs');
  eval(fs.readFileSync(__dirname+ '/lightgl.js','utf8'));
}

document.setTitle("Raytracing");
requestAnimationFrame = document.requestAnimationFrame;

var angleX = 30;
var angleY = 10;
var gl = GL.create();
var mesh = GL.Mesh.plane();
var shader = new GL.Shader('\
  uniform vec3 ray00;\
  uniform vec3 ray10;\
  uniform vec3 ray01;\
  uniform vec3 ray11;\
  varying vec3 initialRay;\
  \
  void main() {\
    vec2 t = gl_Vertex.xy * 0.5 + 0.5;\
    initialRay = mix(mix(ray00, ray10, t.x), mix(ray01, ray11, t.x), t.y);\
    gl_Position = gl_Vertex;\
  }\
', '\
  const float INFINITY = 1.0e9;\
  uniform vec3 eye;\
  varying vec3 initialRay;\
  \
  float intersectSphere(vec3 origin, vec3 ray, vec3 sphereCenter, float sphereRadius) {\
    vec3 toSphere = origin - sphereCenter;\
    float a = dot(ray, ray);\
    float b = 2.0 * dot(toSphere, ray);\
    float c = dot(toSphere, toSphere) - sphereRadius * sphereRadius;\
    float discriminant = b * b - 4.0 * a * c;\
    if (discriminant > 0.0) {\
      float t = (-b - sqrt(discriminant)) / (2.0 * a);\
      if (t > 0.0) return t;\
    }\
    return INFINITY;\
  }\
  \
  void main() {\
    vec3 origin = eye, ray = initialRay, color = vec3(0.0), mask = vec3(1.0);\
    vec3 sphereCenter = vec3(0.0, 1.6, 0.0);\
    float sphereRadius = 1.5;\
    \
    for (int bounce = 0; bounce < 2; bounce++) {\
      /* Find the closest intersection with the scene */\
      float planeT = -origin.y / ray.y;\
      vec3 hit = origin + ray * planeT;\
      if (planeT < 0.0 || abs(hit.x) > 4.0 || abs(hit.z) > 4.0) planeT = INFINITY;\
      float sphereT = intersectSphere(origin, ray, sphereCenter, sphereRadius);\
      float t = min(planeT, sphereT);\
      \
      /* The background is white */\
      if (t == INFINITY) {\
        color += mask;\
        break;\
      }\
      \
      /* Calculate the intersection */\
      hit = origin + ray * t;\
      if (t == planeT) {\
        /* Look up the checkerboard color */\
        vec3 c = fract(hit * 0.5) - 0.5;\
        float checkerboard = c.x * c.z > 0.0 ? 1.0 : 0.0;\
        color += vec3(1.0, checkerboard, 0.0) * mask;\
        break;\
      } else {\
        /* Get the sphere color and reflect a new ray for the next iteration */\
        vec3 normal = (hit - sphereCenter) / sphereRadius;\
        ray = reflect(ray, normal);\
        origin = hit;\
        mask *= 0.8 * (0.5 + 0.5 * max(0.0, normal.y));\
      }\
    }\
    \
    gl_FragColor = vec4(color, 1.0);\
  }\
');

gl.onmousemove = function(e) {
  if (e.dragging) {
    angleY += e.deltaX;
    angleX += e.deltaY;
    angleX = Math.max(-90, Math.min(90, angleX));
    gl.ondraw();
  }
};

gl.ondraw = function() {
  // Camera setup
  gl.loadIdentity();
  gl.translate(0, 0, -10);
  gl.rotate(angleX, 1, 0, 0);
  gl.rotate(angleY, 0, 1, 0);

  // Get corner rays
  var w = gl.canvas.width;
  var h = gl.canvas.height;
  var tracer = new GL.Raytracer();
  shader.uniforms({
    eye: tracer.eye,
    ray00: tracer.getRayForPixel(0, h),
    ray10: tracer.getRayForPixel(w, h),
    ray01: tracer.getRayForPixel(0, 0),
    ray11: tracer.getRayForPixel(w, 0)
  });

  // Trace the rays
  shader.draw(mesh);

  // Draw debug output to show that the raytraced scene lines up correctly with
  // the rasterized scene
  gl.color(0, 0, 0, 0.5);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.begin(gl.LINES);
  for (var s = 4, i = -s; i <= s; i++) {
    gl.vertex(-s, 0, i);
    gl.vertex(s, 0, i);
    gl.vertex(i, 0, -s);
    gl.vertex(i, 0, s);
  }
  gl.end();
  gl.disable(gl.BLEND);
};

gl.fullscreen();
gl.animate();
