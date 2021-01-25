/*
 * File: Engine_Core.js 
 * The first iteration of what the core of our game engine would look like.
 */
"use strict"; 

import * as vertexBuffer from './Engine_VertexBuffer.js';
// instance variables
// 
// The graphical context to draw to
let gGL = null;

// initialize the WebGL, the vertex buffer and compile the shaders
function initWebGL(htmlCanvasID) {
    var canvas = document.getElementById(htmlCanvasID);

    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable gGL
    gGL = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2");

    if (gGL === null) {
        document.write("<br><b>WebGL 2 is not supported!</b>");
        return;
    }
};

// initialize the WebGL, and the vertex buffer
function initEngine(htmlCanvasID) {
    initWebGL(htmlCanvasID);  // setup gGL
    vertexBuffer.init();       // setup gGLVertexBuffer
};

// Clears the draw area and draws one square
function clearCanvas(color) {
    gGL.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
    gGL.clear(gGL.COLOR_BUFFER_BIT);      // clear to the color previously set
};

export { gGL, initEngine, clearCanvas };