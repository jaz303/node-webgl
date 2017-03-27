node.js port of WebGL v1 for non-browser targets.

Supported targets:

  - Windows (via GLEW)
  - Mac OS (via GLEW)
  - iOS
  - Desktop Linux (via GLEW)
  - Raspberry Pi (Raspbian)

This started as a fork of mikeseven/node-webgl (itself an extension of creationix/node-webgl). The major difference is that this fork does not handle creation of a window/GL context; these are the responsiblity of the user and must be set up before this library is used.

## Dependencies

  - node-gyp if not already available in your distribution
  - GLEW

## Installation

```shell
npm install node-webgl
```

## Images

(not yet implemented, coming soon)

`node-webgl` supports images conforming to the following structure:

```
{
	width : number, // width of image in pixels
	height : number, // height of image in pixels
	data : ArrayBufferView, // pixel data
	pitch : number? // length of a row of pixels in bytes
}
```

This is designed to be compatible with the browser `ImageData` interface.

`pitch` is optional, if omitted it is assumed that `pitch == width`.

### Installation Notes for Windows 7

Beware of the Node.JS distribution you use. The default Node.JS is 32-bit and this means that modules will be compiled by node-gyp with 32-bit settings, which often leads to compilation errors especially on 64-bit systems.

So for Windows 7 64-bit, instead of downloading the default Node.JS windows installer, select 'Other release files'.

This will show you an ftp site for the latest release. Go into x64 folder and download that distribution.

### Installation Notes for macOS

```shell
brew install glew
```

## Limitations

WebGL is based on OpenGL ES, a restriction of OpenGL found on desktops, for embedded systems. Because this module wraps OpenGL, it is possible to do things that may not work on web browsers. Please read http://www.khronos.org/webgl/wiki_1_15/index.php/WebGL_and_OpenGL_Differences to learn about the differences.

- shaders
Remember to add this on top of your fragment shaders:
<pre>
#ifdef GL_ES
precision highp float;
#endif
</pre>
