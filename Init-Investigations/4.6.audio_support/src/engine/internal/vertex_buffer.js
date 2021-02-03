"use strict"

import * as gl from './gl.js';

// First: define the vertices for a square
let verticesOfSquare = [
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0
];

// reference to the vertex positions for the square in the gl context
let mGLVertexBuffer = null;

function get() { return mGLVertexBuffer; }

function init() {
    // Step A: Create a buffer on the core_gl context for our vertex positions
    mGLVertexBuffer = gl.get().createBuffer();
       
    // Step B: Activate vertexBuffer
    gl.get().bindBuffer(gl.get().ARRAY_BUFFER, mGLVertexBuffer);

    // Step C: Loads verticesOfSquare into the vertexBuffer
    gl.get().bufferData(gl.get().ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.get().STATIC_DRAW);
};

export {get, init};

