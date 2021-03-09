"use strict";  // Operate in Strict mode such that letiables must be declared before used!

import engine from '../engine/index.js'

class MyGame {
    constructor(htmlCanvasID) {
        // variables of the shader for drawing: one shader to be shared by two renderables
        engine.init(htmlCanvasID);

        // Step B: Create the shader
        this.mConstColorShader = new engine.SimpleShader(
            "src/glsl_shaders/simple_vs.glsl",      // Path to the VertexShader 
            "src/glsl_shaders/simple_fs.glsl");     // Path to the Simple FragmentShader
    
        // Step C: Create the Renderable objects:
        this.mWhiteSq = new engine.Renderable(this.mConstColorShader);
        this.mWhiteSq.setColor([1, 1, 1, 1]);
        this.mRedSq = new engine.Renderable(this.mConstColorShader);
        this.mRedSq.setColor([1, 0, 0, 1]);
    
        // Step D: Draw!
        engine.clearCanvas([0, 0.8, 0, 1]);  // 1. Clear the canvas
    
        // create a new identity transform operator
        var trsMatrix = mat4.create();
    
        // Step E: compute the white square transform 
        mat4.translate(trsMatrix, trsMatrix, vec3.fromValues(-0.25, 0.25, 0.0));
        mat4.rotateZ(trsMatrix, trsMatrix, 0.2); // rotation is in radian
        mat4.scale(trsMatrix, trsMatrix, vec3.fromValues(1.2, 1.2, 1.0));
        // Step F: draw the white square with the computed transform
        this.mWhiteSq.draw(trsMatrix);
    
        // Step G: compute the red square transform
        mat4.identity(trsMatrix); // restart
        mat4.translate(trsMatrix, trsMatrix, vec3.fromValues(0.25, -0.25, 0.0));
        mat4.rotateZ(trsMatrix, trsMatrix, -0.785); // rotation is in radian (about -45-degree)
        mat4.scale(trsMatrix, trsMatrix, vec3.fromValues(0.4, 0.4, 1.0));
        // Step H: draw the red square with the computed transform
        this.mRedSq.draw(trsMatrix);
    }
}

window.onload = function () {
    new MyGame('GLCanvas');
}