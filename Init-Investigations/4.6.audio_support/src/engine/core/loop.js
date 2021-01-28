/*
 * File: EngineCore_Loop.js 
 * Implements the game loop functionality of gEngine
 */
/*jslint node: true, vars: true */
/*global gEngine: false, requestAnimationFrame: false */
/* find out more about jslint: http://www.jslint.com/help.html */

import * as input from './input.js'

const FPS = 60; // Frames per second
const MPF = 1000 / FPS; // Milliseconds per frame.

// Variables for timing gameloop.
let prevTime;
let lagTime;

// The current loop state (running or should stop)
let loopRunning = false;
let currentScene = null;

// This function assumes it is sub-classed from MyGame
function loopOnce() {
    if (loopRunning) {
        // Step A: set up for next call to LoopOnce and update input!
        requestAnimationFrame(loopOnce);

        // Step B: compute how much time has elapsed since we last LoopOnce was executed
        var currentTime = Date.now();
        var elapsedTime = currentTime - prevTime;
        prevTime = currentTime;
        lagTime += elapsedTime;

        // Step C: Make sure we update the game the appropriate number of times.
        //      Update only every Milliseconds per frame.
        //      If lag larger then update frames, update until caught up.
        while ((lagTime >= MPF) && loopRunning) {
            input.update();
            currentScene.update();      
            lagTime -= MPF;
        }
        // Step D: now let's draw
        currentScene.draw();    
    } else {
        // this scene is done, unload it!
        currentScene.takedown();
    }
};


async function start(scene) {
    if (loopRunning) {
        throw new Error("loop already running")
    }
    await scene.setup();
    currentScene = scene;
    prevTime = Date.now();
    lagTime = 0.0;
    loopRunning = true;
    requestAnimationFrame(loopOnce);
};

function stop() {
    loopRunning = false;
};

export {start, stop};