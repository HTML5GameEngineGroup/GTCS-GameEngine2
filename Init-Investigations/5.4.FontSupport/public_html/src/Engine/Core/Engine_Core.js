/*
 * File: EngineCore.js 
 * The first iteration of what the core of our game engine would look like.
 */

"use strict"; // Operate in Strict mode such that variables must be declared before used!

import * as audio from './Resources/Engine_AudioClips.js';
import * as defaultResources from './Resources/Engine_DefaultResources.js'

// Engine modules
import * as vertexBuffer from './Engine_VertexBuffer.js';
import * as input from './Engine_Input.js';
import * as loop from  './Engine_GameLoop.js';
import Scene from '../Scene.js';

// The graphical context to draw to
let gGL = null;

// initialize the WebGL, the vertex buffer and compile the shaders
function initWebGL(htmlCanvasID) {
    let canvas = document.getElementById(htmlCanvasID);
    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable gGL
    gGL = canvas.getContext("webgl", {alpha: false}) || canvas.getContext("experimental-webgl", {alpha: false});
    // Allows transperency with textures.
    gGL.blendFunc(gGL.SRC_ALPHA, gGL.ONE_MINUS_SRC_ALPHA);
    gGL.enable(gGL.BLEND);
    // Set images to flip y axis to match the texture coordinate space.
    gGL.pixelStorei(gGL.UNPACK_FLIP_Y_WEBGL, true);
    if (gGL === null) {
        document.write("<br><b>WebGL is not supported!</b>");
        return;
    }
};

// initialize all of the EngineCore components
function initEngineCore (htmlCanvasID, myGame) {
    initWebGL(htmlCanvasID);
    vertexBuffer.init();
    input.init();
    audio.init();
    // Inits DefaultResources, when done, invoke the anonymous function to call startScene(myGame).
    defaultResources.init(
         function () { startScene(myGame); });
};

// Clears the draw area and draws one square
function clearCanvas (color) {
    gGL.clearColor(color[0], color[1], color[2], color[3]); // set the color to be cleared
    gGL.clear(gGL.COLOR_BUFFER_BIT); // clear to the color previously set
};
        
function startScene (scene) {
    scene.loadScene.call(scene); // Called in this way to keep correct context
    loop.start(scene); // will wait until async loading is done and call scene.initialize()
};

function cleanUp () {
    defaultResources.cleanUp();
    vertexBuffer.cleanUp();
};
        
export {gGL,
        initEngineCore as initEngine, 
        clearCanvas, 
        startScene,
        cleanUp };
        
