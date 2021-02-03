
"use strict"

import * as resourceMap from '../internal/resource_map.js'
import * as input from './input.js'

const FPS = 60; // Frames per second
const MPF = 1000 / FPS; // Milliseconds per frame.

// Variables for timing gameloop.
let mPrevTime;
let mLagTime;

// The current loop state (running or should stop)
let mLoopRunning = false;
let mCurrentScene = null;

// This function assumes it is sub-classed from MyGame
function loopOnce() {
    if (mLoopRunning) {
        // Step A: set up for next call to LoopOnce and update input!
        requestAnimationFrame(loopOnce);

        // Step B: compute how much time has elapsed since we last LoopOnce was executed
        var currentTime = Date.now();
        var elapsedTime = currentTime - mPrevTime;
        mPrevTime = currentTime;
        mLagTime += elapsedTime;

        // Step C: Make sure we update the game the appropriate number of times.
        //      Update only every Milliseconds per frame.
        //      If lag larger then update frames, update until caught up.
        while ((mLagTime >= MPF) && mLoopRunning) {
            input.update();
            mCurrentScene.update();      
            mLagTime -= MPF;
        }
        // Step D: now let's draw
        mCurrentScene.draw();    
    } else {
        // this scene is done, unload it!
        mCurrentScene.unload();
    }
};


async function start(scene) {
    if (mLoopRunning) {
        throw new Error("loop already running")
    }
    await resourceMap.waitOnPromise();

    mCurrentScene = scene;
    mCurrentScene.load();
    await resourceMap.waitOnPromise();
    
    mCurrentScene.init();    
    mPrevTime = Date.now();
    mLagTime = 0.0;
    mLoopRunning = true;
    requestAnimationFrame(loopOnce);
};

function stop() {
    mLoopRunning = false;
};

export {start, stop};