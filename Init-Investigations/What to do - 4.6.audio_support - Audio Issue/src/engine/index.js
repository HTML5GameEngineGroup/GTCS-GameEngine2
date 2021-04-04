/*
 * File: index.js
 *  
 * serves as central export of the entire engine
 * client programs can simply import this file 
 * for all symbols defined in the engine
 * 
 */
"use strict"

// Core
import * as input from "./core/input.js";
import * as loop from "./core/internal/loop.js";

// Resources
import * as audio from "./resources/audio.js";
import * as text from "./resources/text.js";
import * as xml from "./resources/xml.js";
import * as defaultResources from "./resources/default_resources.js";

// general utiities
import Camera from "./camera.js";
import Scene from "./scene.js";
import Transform from "./transform.js";
import Renderable from "./renderable.js";


// local to this file only
import * as glSys from "./core/internal/gl.js";
import * as vertexBuffer from "./core/internal/vertex_buffer.js";

// general engine utilities
function init(htmlCanvasID) {
    glSys.init(htmlCanvasID);
    vertexBuffer.init();
    input.init();
    audio.init();
    defaultResources.init();
}

function cleanUp() {
    loop.cleanUp();
    defaultResources.cleanUp();
    audio.cleanUp();
    input.cleanUp();
    vertexBuffer.cleanUp();
    glSys.cleanUp();
}

function clearCanvas(color) {
    let gl = glSys.get();
    gl.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
    gl.clear(gl.COLOR_BUFFER_BIT);      // clear to the color previously set
}


export default {
    // resource support
    audio, text, xml, defaultResources,

    // input support
    input,

    // Util classes
    Camera, Scene, Transform, Renderable,

    // functions
    init, cleanUp, clearCanvas
}
