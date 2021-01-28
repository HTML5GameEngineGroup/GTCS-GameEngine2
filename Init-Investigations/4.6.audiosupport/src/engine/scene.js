/* 
 * The template for a scene.
 */

import core from './core/index.js'

const abstractClassError = new Error("Abstract Class")
const abstractMethodError = new Error("Abstract Method")

class Scene {
    constructor() {
        if (this.constructor === Scene) {
            throw abstractClassError
        }
    }

    async start() {
        await core.loop.start(this)
    }

    stop() {
        core.loop.stop()
    }

    async setup() {
        // initialize the level and load resources (called from GameLoop)
        throw abstractMethodError
    };


    takedown() {
        // .. unload all resources
        throw abstractMethodError
    };

    // update to be called form EngineCore.GameLoop
    update() {
        // when done with this level should call this.stop()
        throw abstractMethodError
    };

    // draw to be called from EngineCore.GameLoop
    draw() {
        throw abstractMethodError
    };

};

export default Scene;