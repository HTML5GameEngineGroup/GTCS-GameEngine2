"use strict"

import * as GLSys from './gl.js';

// First: define the vertices for a square
let mVerticesOfSquare = [
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0
];

// reference to the vertex positions for the square in the gl context
let mGLVertexBuffer = null;

function get() { return mGLVertexBuffer; }
function cleanUp() { GLSys.get().deleteBuffer(mGLVertexBuffer); }

function init() {
    let  gl = GLSys.get();

    // Step A: Create a buffer on the core_gl context for our vertex positions
    mGLVertexBuffer = gl.createBuffer();
       
    // Step B: Activate vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLVertexBuffer);

    // Step C: Loads mVerticesOfSquare into the vertexBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);
}

export {init, cleanUp,
        get}

