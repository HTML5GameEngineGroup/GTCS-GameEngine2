"use strict"

import * as GLSys from './gl.js'

// First: define the vertices for a square
let mVerticesOfSquare = [
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0
];

// Second: define the corresponding texture coordinates
let mTextureCoordinates = [
    1.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    0.0, 0.0
];

// reference to the vertex positions for the square in the gl context
let mGLVertexBuffer = null;

// reference to the texture cooredinates for the square vertices in the gl context
let mGLTextureCoordBuffer = null;

function get() { return mGLVertexBuffer; }
function getTexCoord() { return mGLTextureCoordBuffer; }

function cleanUp() { 
	let gl = GLSys.get()
	gl.deleteBuffer(mGLVertexBuffer); 
	gl.deleteBuffer(mGLTextureCoordBuffer); 
}

function init() {
    let gl = GLSys.get();

    // Step A: Create a buffer on the gl context for our vertex positions
    mGLVertexBuffer = gl.createBuffer();
       
    // Step B: Activate vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLVertexBuffer);

    // Step C: Loads verticesOfSquare into the vertexBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);

    // Step  B: Allocate and store texture coordinates"
    // Create a buffer on the gl context for texture coordinates
    mGLTextureCoordBuffer = gl.createBuffer();

    // Activate vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLTextureCoordBuffer);

    // Loads textureCoordinates into the vertexBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mTextureCoordinates), gl.STATIC_DRAW);   
}

export {init, cleanUp, 
        get, getTexCoord}

