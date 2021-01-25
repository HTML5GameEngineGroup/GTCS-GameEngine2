/*
 * File: EngineCore_VertexBuffer.js
 *  
 * defines the object that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the core_gl context
 * 
 */
"use strict";

import * as core from './Engine_Core.js';

    // reference to the vertex positions for the square in the gl context
let mGLVertexBuffer = null;

// First: define the vertices for a square
let verticesOfSquare = [
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0
];

function initVertexBuffer() {
    
    // Step A: Create a buffer on the core_gl context for our vertex positions
    mGLVertexBuffer = core.gGL.createBuffer();
       
    // Step B: Activate vertexBuffer
    core.gGL.bindBuffer(core.gGL.ARRAY_BUFFER, mGLVertexBuffer);

    // Step C: Loads verticesOfSquare into the vertexBuffer
    core.gGL.bufferData(core.gGL.ARRAY_BUFFER, new Float32Array(verticesOfSquare), core.gGL.STATIC_DRAW);
};

export { initVertexBuffer as init, mGLVertexBuffer };