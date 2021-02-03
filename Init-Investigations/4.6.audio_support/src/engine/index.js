"use strict"

// Resources
import * as audio from './resources/audio.js'
import * as text from './resources/text.js'
import * as xml from './resources/xml.js'
import * as defaultResources from './resources/default_resources.js'

// core
import * as input from './core/input.js'
import * as loop from './core/loop.js'

// Types
import Camera from './camera.js'
import Scene from './scene.js'
import Transform from './transform.js'
import SimpleShader from './simple_shader.js'
import Renderable from './renderable.js'

// local to this file only
import * as gl from './internal/gl.js'
import * as vertexBuffer from './internal/vertex_buffer.js';

// general engine utilities

function init(htmlCanvasID) {
    gl.init(htmlCanvasID);
    vertexBuffer.init();
    input.init();
    audio.init();
    defaultResources.init();
}

function clearCanvas(color) {
    gl.get().clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
    gl.get().clear(gl.get().COLOR_BUFFER_BIT);      // clear to the color previously set
};


export default {
    //
    audio, text, xml, defaultResources,

    // core
    input, loop,

    // Util classes
    Camera, Scene, Transform, SimpleShader, Renderable,

    // functions
    init, clearCanvas
};
