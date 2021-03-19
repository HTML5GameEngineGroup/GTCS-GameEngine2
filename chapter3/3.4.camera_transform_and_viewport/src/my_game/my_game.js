"use strict";  // Operate in Strict mode such that letiables must be declared before used!

// import from engine internal is not desirable
// we will define Camera class to hide this in the next project
import * as GLSys from "../engine/core/internal/gl.js";

import engine from "../engine/index.js";

class MyGame {
    constructor(htmlCanvasID) {
        // letiables of the shader for drawing: one shader to be shared by two renderables
        this.mConstColorShader = null;

        // letiables for the squares
        this.mBlueSq = null;        // these are the Renderable objects
        this.mRedSq = null;

        // Step A: Initialize the webGL Context
        engine.init(htmlCanvasID);
        let gl = GLSys.get();

        // Step B: Create the shader
        this.mConstColorShader = new engine.SimpleShader(
            "src/glsl_shaders/simple_vs.glsl",      // Path to the VertexShader 
            "src/glsl_shaders/simple_fs.glsl");    // Path to the simple FragmentShader

        // Step C: Create the Renderable objects:
        this.mBlueSq = new engine.Renderable(this.mConstColorShader);
        this.mBlueSq.setColor([0.25, 0.25, 0.95, 1]);
        this.mRedSq = new engine.Renderable(this.mConstColorShader);
        this.mRedSq.setColor([1, 0.25, 0.25, 1]);
        this.mTLSq = new engine.Renderable(this.mConstColorShader);
        this.mTLSq.setColor([0.9, 0.1, 0.1, 1]);
        this.mTRSq = new engine.Renderable(this.mConstColorShader);
        this.mTRSq.setColor([0.1, 0.9, 0.1, 1]);
        this.mBRSq = new engine.Renderable(this.mConstColorShader);
        this.mBRSq.setColor([0.1, 0.1, 0.9, 1]);
        this.mBLSq = new engine.Renderable(this.mConstColorShader);
        this.mBLSq.setColor([0.1, 0.1, 0.1, 1]);

        // Step D: Clear the entire canvas first
        engine.clearCanvas([0.9, 0.9, 0.9, 1]);   // Clear the canvas

        // Step E: Setting up Viewport>
        // Step E1: Set up the viewport: area on canvas to be drawn
        gl.viewport(
            20,     // x position of bottom-left corner of the area to be drawn
            40,     // y position of bottom-left corner of the area to be drawn
            600,    // width of the area to be drawn
            300);     // height of the area to be drawn

        // Step E2: set up the corresponding scissor area to limit clear area
        gl.scissor(
            20,     // x position of bottom-left corner of the area to be drawn
            40,     // y position of bottom-left corner of the area to be drawn
            600,    // width of the area to be drawn
            300);    // height of the area to be drawn

        // Step E3: enable the scissor area, clear, and then disable the scissor area
        gl.enable(gl.SCISSOR_TEST);
        engine.clearCanvas([0.8, 0.8, 0.8, 1.0]);  // clear the scissor area
        gl.disable(gl.SCISSOR_TEST);


        // Step F: Set up camera's transform matrix
        // assume camera position and dimension
        let cameraCenter = vec2.fromValues(20, 60);
        let wcSize = vec2.fromValues(20, 10);
        let cameraMatrix = mat4.create();
        // Step F1: following the translation, scale to: (-1, -1) to (1, 1): a 2x2 square at origin
        mat4.scale(cameraMatrix, mat4.create(), vec3.fromValues(2.0 / wcSize[0], 2.0 / wcSize[1], 1.0));

        // Step F2: first operation to perform is to translate camera center to the origin
        mat4.translate(cameraMatrix, cameraMatrix, vec3.fromValues(-cameraCenter[0], -cameraCenter[1], 0));

        // Step G: Draw the blue square
        // Centre Blue, slightly rotated square
        this.mBlueSq.getXform().setPosition(20, 60);
        this.mBlueSq.getXform().setRotationInRad(0.2); // In Radians
        this.mBlueSq.getXform().setSize(5, 5);
        this.mBlueSq.draw(cameraMatrix);

        // Step H: Draw the center and the corner squares
        // centre red square
        this.mRedSq.getXform().setPosition(20, 60);
        this.mRedSq.getXform().setSize(2, 2);
        this.mRedSq.draw(cameraMatrix);

        // top left
        this.mTLSq.getXform().setPosition(10, 65);
        this.mTLSq.draw(cameraMatrix);

        // top right
        this.mTRSq.getXform().setPosition(30, 65);
        this.mTRSq.draw(cameraMatrix);

        // bottom right
        this.mBRSq.getXform().setPosition(30, 55);
        this.mBRSq.draw(cameraMatrix);

        // bottom left
        this.mBLSq.getXform().setPosition(10, 55);
        this.mBLSq.draw(cameraMatrix);
    }
}

window.onload = function () {
    new MyGame('GLCanvas');
}