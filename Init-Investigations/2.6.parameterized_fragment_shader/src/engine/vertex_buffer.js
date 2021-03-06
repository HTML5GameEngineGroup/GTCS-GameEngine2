/*
 * File: vertex_bufdfer.js
 *  
 * defines the object that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the core.gGL context
 * 
 */
"use strict";

import * as core from './core.js'

    // reference to the vertex positions for the square in the gl context
let mGLVertexBuffer = null;

// First: define the vertices for a square
let mVerticesOfSquare = [
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0
];

function init() {
    
    // Step A: Create a buffer on the core.gGL context for our vertex positions
    mGLVertexBuffer = core.gGL.createBuffer();
       
    // Step B: Activate vertexBuffer
    core.gGL.bindBuffer(core.gGL.ARRAY_BUFFER, mGLVertexBuffer);

    // Step C: Loads mVerticesOfSquare into the vertexBuffer
    core.gGL.bufferData(core.gGL.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), core.gGL.STATIC_DRAW);
}

export {init, mGLVertexBuffer}