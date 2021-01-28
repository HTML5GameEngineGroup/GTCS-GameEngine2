/*
 * File: EngineCore.js 
 * The first iteration of what the core of our game engine would look like.
 */

import * as audio from '../resources/audio.js';
import * as text from '../resources/text.js'
import * as gl from './gl.js';
import * as vertexBuffer from './vertexbuffer.js';
import * as input from './input.js';
import SimpleShader from '../simpleshader.js';



const simpleVS = "src/glslshaders/simplevs.glsl";  // Path to the VertexShader 
const simpleFS = "src/glslshaders/simplefs.glsl";  // Path to the simple FragmentShader

let constColorShader = null;

// initialize the WebGL, and the vertex buffer
export async function init(htmlCanvasID) {
    gl.init(htmlCanvasID)  // setup gGL
    vertexBuffer.init();
    input.init();
    audio.init();


    await Promise.all([text.load(simpleVS), text.load(simpleFS)]);
    constColorShader = new SimpleShader(simpleVS, simpleFS);
};

// Clears the draw area and draws one square
export function clearCanvas(color) {
    console.log(new Error().stack)
    gl.get().clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
    gl.get().clear(gl.get().COLOR_BUFFER_BIT);      // clear to the color previously set
};

export function getConstColorShader() { return constColorShader; }