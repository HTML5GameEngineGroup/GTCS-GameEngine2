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
import * as loop from './core/internal/loop.js'

// general utiities
import Camera from './camera.js'
import Transform from './transform.js'
import Renderable from './renderable.js'
import SimpleShader from './simple_shader.js'


// local to this file only
import * as GLSys from './core/internal/gl.js'
import * as vertexBuffer from './core/internal/vertex_buffer.js'

// general engine utilities
function init(htmlCanvasID) {
    GLSys.init(htmlCanvasID);
    vertexBuffer.init();
}

function clearCanvas(color) {
    let gl = GLSys.get();
    gl.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
    gl.clear(gl.COLOR_BUFFER_BIT);      // clear to the color previously set
}

export default {
    // Util classes
    Camera, Transform, SimpleShader, Renderable,

    // functions
    init, clearCanvas
}