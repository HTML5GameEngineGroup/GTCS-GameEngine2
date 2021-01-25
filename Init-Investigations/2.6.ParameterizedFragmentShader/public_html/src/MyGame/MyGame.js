/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as core from '../Engine/Engine_Core.js';
import SimpleShader from '../Engine/SimpleShader.js';

class MyGame {
    constructor(htmlCanvasID) {
        // The shader for drawing
        this.mShader = null;

        // Step A: Initialize the webGL Context and the VertexBuffer
        core.initEngine(htmlCanvasID);

        // Step B: Create, load and compile the shaders
        this.mShader = new SimpleShader(
            "src/GLSLShaders/SimpleVS.glsl",        // Path to the VertexShader 
            "src/GLSLShaders/SimpleFS.glsl");       // Path to the FragmentShader

        // Step C: Draw!
        // Step C1: Clear the canvas
        core.clearCanvas([0, 0.8, 0, 1]);

        // Step C2: Activate the proper shader
        this.mShader.activateShader([1, 0, 0, 1]);
        
        // Step C3: Draw with the currently activated geometry and the activated shader        
        core.gGL.drawArrays(core.gGL.TRIANGLE_STRIP, 0, 4);
    }
}

window.onload = function() {
    new MyGame('GLCanvas');
};