/*
 * File: EngineCore.js 
 * The first iteration of what the core of our game engine would look like.
 */
/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, document: false */
/* find out more about jslint: http://www.jslint.com/help.html */

//  Global variable EngineCore
//  the following syntax enforces there can only be one instance of EngineCore object
"use strict";  // Operate in Strict mode such that variables must be declared before used!

// Resoruces modules
import * as audio from './Resources/Engine_AudioClips.js';
import * as defaultResources from './Resources/Engine_DefaultResources.js'

// Engine modules
import * as vertexBuffer from './Engine_VertexBuffer.js';
import * as input from './Engine_Input.js';
import * as loop from  './Engine_GameLoop.js';

import Scene from '../Scene.js';
// instance variables
// 
// The graphical context to draw to
let gGL = null;

// initialize the WebGL, the vertex buffer and compile the shaders
function initWebGL(htmlCanvasID) {
    var canvas = document.getElementById(htmlCanvasID);

    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable mGL
    gGL = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2");

    if (gGL === null) {
        document.write("<br><b>WebGL 2 is not supported!</b>");
        return;
    }
};

// initialize the WebGL, and the vertex buffer
function initEngineCore(htmlCanvasID, myGame) {
    initWebGL(htmlCanvasID);  // setup gGL
    vertexBuffer.init();       // setup gGLVertexBuffer
    input.init();
    audio.init();
    defaultResources.init(
        function() { startScene(myGame); } );
};

// Clears the draw area and draws one square
function clearCanvas(color) {
    gGL.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
    gGL.clear(gGL.COLOR_BUFFER_BIT);      // clear to the color previously set
};
    

function startScene(scene) {
    scene.loadScene(); // 
    loop.startLoop(scene); // will wait until async loading is done and call scene.initialize()
};

export {gGL, 
    initEngineCore as initEngine, 
    clearCanvas, 
    startScene };