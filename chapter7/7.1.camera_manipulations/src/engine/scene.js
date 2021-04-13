/*
 * File: scene.js
 *
 * The template for a scene.
 * 
 */
"use strict";

import  * as loop from "./core/loop.js";
import engine from "./index.js";

const abstractClassError = new Error("Abstract Class")
const abstractMethodError = new Error("Abstract Method")

class Scene {
    constructor() {
        if (this.constructor === Scene) {
            throw abstractClassError
        }
    }

    async start() {
        await loop.start(this);
    }

    stop() {
        loop.stop();
        this.unload();
        engine.cleanUp();
    }

    next() {
        loop.stop();
        this.unload();
    }

    
    init() {
        // initialize the level and load resources (called from GameLoop)
        // throw abstractMethodError
    }

    load() { 
        // to load necessary resources
    } 

    unload() {
        // .. unload all resources
        // throw abstractMethodError
    }

    // update to be called form EngineCore.GameLoop
    update() {
        // when done with this level should call this.stop()
        throw abstractMethodError
    }

    // draw to be called from EngineCore.GameLoop
    draw() {
        throw abstractMethodError
    }

}

export default Scene;