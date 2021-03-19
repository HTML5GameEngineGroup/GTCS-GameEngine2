"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

class MyGmae {
    constructor(htmlCanvasID) {
        // variables of the shader for drawing: one shader to be shared by two renderables
        this.mConstColorShader = null;

        // variables for the squares
        this.mBlueSq = null;        // these are the Renderable objects
        this.mRedSq = null;

        // Step A: Initialize the webGL Context
        engine.init(htmlCanvasID);

        // Step B: Setup the camera
        this.mCamera = new engine.Camera(
            vec2.fromValues(20, 60),   // center of the WC
            20,                        // width of WC
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
            );

        // Step C: Create the shader
        this.mConstColorShader = new engine.SimpleShader(
            "src/glsl_shaders/simple_vs.glsl",      // Path to the VertexShader 
            "src/glsl_shaders/simple_fs.glsl");    // Path to the simple FragmentShader

        // Step D: Create the Renderable objects:
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

        // Step E: Clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1]);        // Clear the canvas

        // Step F: Starts the drawing by activating the camera
        this.mCamera.setViewAndCameraMatrix();

        // Step G: Draw the blue square
        // Centre Blue, slightly rotated square
        this.mBlueSq.getXform().setPosition(20, 60);
        this.mBlueSq.getXform().setRotationInRad(0.2); // In Radians
        this.mBlueSq.getXform().setSize(5, 5);
        this.mBlueSq.draw(this.mCamera);

        // Step H: Draw the center and the corner squares
        // centre red square
        this.mRedSq.getXform().setPosition(20, 60);
        this.mRedSq.getXform().setSize(2, 2);
        this.mRedSq.draw(this.mCamera);

        // top left
        this.mTLSq.getXform().setPosition(10, 65);
        this.mTLSq.draw(this.mCamera);

        // top right
        this.mTRSq.getXform().setPosition(30, 65);
        this.mTRSq.draw(this.mCamera);

        // bottom right
        this.mBRSq.getXform().setPosition(30, 55);
        this.mBRSq.draw(this.mCamera);

        // bottom left
        this.mBLSq.getXform().setPosition(10, 55);
        this.mBLSq.draw(this.mCamera);
    }
}

window.onload = function() {
    new MyGmae('GLCanvas');
}