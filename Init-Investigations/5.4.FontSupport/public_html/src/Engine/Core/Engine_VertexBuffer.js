/*
 * File: EngineCore_VertexBuffer.js
 *  
 * defines the object that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gGL context
 * 
 * Notice, this is a singleton object.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Float32Array: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as core from './Engine_Core.js';

// reference to the vertex positions for the square in the gl context
let mGLVertexBuffer = null;

// reference to the texture positions for the square vertices in the gl context
let mGLTextureCoordBuffer = null;

// First: define the vertices for a square
let verticesOfSquare = [
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0
];

// Second: define the corresponding texture coordinates
var textureCoordinates = [
    1.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    0.0, 0.0
];

function initVertexBuffer() {

    // Step A: Create a buffer on the core_gl context for our vertex positions
    mGLVertexBuffer = core.gGL.createBuffer();
       
    // Activate vertexBuffer
    core.gGL.bindBuffer(core.gGL.ARRAY_BUFFER, mGLVertexBuffer);

    // Loads verticesOfSquare into the vertexBuffer
    core.gGL.bufferData(core.gGL.ARRAY_BUFFER, new Float32Array(verticesOfSquare), core.gGL.STATIC_DRAW);


    // Step  B: Allocate and store texture coordinates
    // Create a buffer on the gGL context for our vertex positions
    mTextureCoordBuffer = core.gGL.createBuffer();

    // Activate vertexBuffer
    core.gGL.bindBuffer(core.gGL.ARRAY_BUFFER, mGLTextureCoordBuffer);

    // Loads verticesOfSquare into the vertexBuffer
    core.gGL.bufferData(core.gGL.ARRAY_BUFFER, new Float32Array(textureCoordinates), core.gGL.STATIC_DRAW);
};

  
function cleanUp() {
    core.gGL.deleteBuffer(mGLVertexBuffer);
    core.gGL.deleteBuffer(mGLTextureCoordBuffer);
};

export {
    initVertexBuffer as init,
    mGLVertexBuffer,
    mGLTextureCoordBuffer,
    cleanUp
};