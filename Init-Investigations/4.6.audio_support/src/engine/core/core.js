/*
 * File: EngineCore.js 
 * The first iteration of what the core of our game engine would look like.
 */

import * as audio from '../resources/audio.js';
import * as text from '../resources/text.js'
import * as gl from './gl.js';
import * as vertexBuffer from './vertex_buffer.js';
import * as input from './input.js';
import SimpleShader from '../simple_shader.js';

const simpleVS = "src/glsl_shaders/simple_vs.glsl";  // Path to the VertexShader 
const simpleFS = "src/glsl_shaders/simple_fs.glsl";  // Path to the simple FragmentShader

let mConstColorShader = null;

// initialize the WebGL, and the vertex buffer
async function init(htmlCanvasID) {
    gl.init(htmlCanvasID)  // setup gGL
    vertexBuffer.init();
    input.init();
    audio.init();

    await Promise.all([text.load(simpleVS), text.load(simpleFS)]);
    mConstColorShader = new SimpleShader(simpleVS, simpleFS);
};

// Clears the draw area and draws one square
function clearCanvas(color) {
    console.log(new Error().stack)
    gl.get().clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
    gl.get().clear(gl.get().COLOR_BUFFER_BIT);      // clear to the color previously set
};

function getConstColorShader() { return mConstColorShader; }

export {init, clearCanvas, getConstColorShader};