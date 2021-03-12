/*
 * File: index.js
 *  
 * serves as central export of the entire engine
 * client programs can simply import this file 
 * for all symbols defined in the engine
 * 
 */
"use strict"

// core
import * as input from './core/input.js'
import * as loop from './core/internal/loop.js'

// resources
import * as audio from './resources/audio.js'
import * as text from './resources/text.js'
import * as xml from './resources/xml.js'
import * as texture from './resources/texture.js'
import * as defaultResources from './resources/default_resources.js'

// general utilities
import Camera from './camera.js'
import Scene from './scene.js'
import Transform from './transform.js'

// shaders
import SimpleShader from './shaders/simple_shader.js'
import TextureShader from './shaders/texture_shader.js'

// renderables 
import Renderable from './renderables/renderable.js'
import TextureRenderable from './renderables/texture_renderable.js'

// local to this file only
import * as GLSys from './core/internal/gl.js'
import * as vertexBuffer from './core/internal/vertex_buffer.js'

// general engine utilities
function init(htmlCanvasID) {
    GLSys.init(htmlCanvasID);
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
    GLSys.cleanUp();
}

function clearCanvas(color) {
    let gl = GLSys.get();
    gl.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
    gl.clear(gl.COLOR_BUFFER_BIT);      // clear to the color previously set
}


export default {
    // resource support
    audio, text, xml, texture, defaultResources,

    // core
    input,

    // Util classes
    Camera, Scene, Transform, 
    
    // Shaders
    SimpleShader, TextureShader,
    
    // Renderables
    Renderable, TextureRenderable,

    // functions
    init, cleanUp, clearCanvas
}
