## Images

This is what is supported in WebGL 1

	// WebGL1:
	1. void gl.texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView? pixels);
	2. void gl.texImage2D(target, level, internalformat, format, type, ImageData? pixels);
	3. void gl.texImage2D(target, level, internalformat, format, type, HTMLImageElement? pixels);
	4. void gl.texImage2D(target, level, internalformat, format, type, HTMLCanvasElement? pixels);
	5. void gl.texImage2D(target, level, internalformat, format, type, HTMLVideoElement? pixels);
	6. void gl.texImage2D(target, level, internalformat, format, type, ImageBitmap? pixels);

1. we support as-is, e.g. passing an ArrayBufferView for the pixel data

2. we will support something close to the ImageData interface, that is, an object with the following keys:
   - width
   - height
   - data (as UInt8ClampedArray)
   - stride/pitch (optional)

Surface objects created by my new SDL bindings will conform to this interface.

Will need to look into how we can glPixelStorei() in combination with stride/pitch to make everything work correctly.

After this, any library that uses images just needs to expose the binary data as an ArrayBufferView.

v8 docs show that it's trivial to create an ArrayBuffer based on existing memory:
http://bespin.cz/~ondras/html/classv8_1_1ArrayBuffer.html
