/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

// client program simple import from engine/index.js for all engine symbols
import engine from "../engine/index.js";

class my_game {
    constructor(htmlCanvasID) {
        /// Step A: Initialize the webGL Context
        engine.init(htmlCanvasID);

        // Step C: Create the Renderable objects:
        this.mWhiteSq = new engine.Renderable();
        this.mWhiteSq.setColor([1, 1, 1, 1]);
        this.mRedSq = new engine.Renderable();
        this.mRedSq.setColor([1, 0, 0, 1]);

        // Step D: Draw!
        engine.clearCanvas([0, 0.8, 0, 1]);  // Clear the canvas

        // Step D1: Draw Renderable objects with the white shader
        this.mWhiteSq.draw();

        // Step D2: Draw Renderable objects with the red shader
        this.mRedSq.draw();
    }
}

window.onload = function () {
    new my_game('GLCanvas');
}