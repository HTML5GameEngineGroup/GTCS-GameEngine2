/* 
 * The template for a scene.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

class Scene {
    // Constructor
    constructor() {}

    //<editor-fold desc="functions subclass should override">

    // Begin Scene: must load all the scene contents
    // when done 
    //  => start the GameLoop
    // The game loop will call initialize and then update/draw
    loadScene() {
        // override to load scene specific contents
    };

    // Performs all initialization functions
    //   => Should call gEngine.GameLoop.start(this)!
    init() {
        // initialize the level (called from GameLoop)
    };

    // update to be called form EngineCore.GameLoop
    update() {
        // when done with this level should call:
        // GameLoop.stop() ==> which will call this.unloadScene();
    };

    // draw to be called from EngineCore.GameLoop
    draw() {};

    // Must unload all resources
    unloadScene() {
        // .. unload all resources
    };
};

export default Scene;