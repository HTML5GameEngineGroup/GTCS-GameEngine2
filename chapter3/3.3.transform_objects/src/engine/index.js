/*
 * File: index.js
 *  
 * serves as central export of the entire engine
 * client programs can simply import this file 
 * for all symbols defined in the engine
 * 
 */
"use strict"

// general utiities
import Transform from "./transform.js";
import Renderable from "./renderable.js";
import SimpleShader from "./simple_shader.js";

// local to this file only
import * as glSys from "./core/gl.js";
import * as vertexBuffer from "./core/vertex_buffer.js";
import * as Shaders from "./core/shader_resources.js";

// general engine utilities
function init(htmlCanvasID) {
    glSys.init(htmlCanvasID);
    vertexBuffer.init();
    Shaders.init();
}

function clearCanvas(color) {
    let gl = glSys.get();
    gl.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
    gl.clear(gl.COLOR_BUFFER_BIT);      // clear to the color previously set
}


export  default {
    // Util classes
    Transform, SimpleShader, Renderable,

    // functions
    init, clearCanvas
}