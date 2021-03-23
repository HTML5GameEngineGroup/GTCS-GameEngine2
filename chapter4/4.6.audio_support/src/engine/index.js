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
import * as loop from "./core/loop.js";

// Resources
import * as audio from "./resources/audio.js";
import * as xml from "./resources/xml.js";
import * as text from "./resources/text.js";

// general utiities
import * as input from "./input.js";
import Scene from "./scene.js";
import Camera from "./camera.js";
import Transform from "./transform.js";
import Renderable from "./renderable.js";
import SimpleShader from "./simple_shader.js";


// local to this file only
import * as glSys from "./core/gl.js";
import * as vertexBuffer from "./core/vertex_buffer.js";
import * as shaderResources from "./core/shader_resources.js";

// general engine utilities
function init(htmlCanvasID) {
    glSys.init(htmlCanvasID);
    vertexBuffer.init();
	shaderResources.init();
    input.init();
    audio.init();
}

function cleanUp() {
    loop.cleanUp();
	audio.cleanUp();
    input.cleanUp();
	shaderResources.cleanUp();
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
    audio, text, xml,

    // core
    input,

    // Util classes
    Camera, Scene, Transform, SimpleShader, Renderable,

    // functions
    init, cleanUp, clearCanvas
}
