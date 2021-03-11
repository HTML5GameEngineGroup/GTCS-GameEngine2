/*
 * File: loop.js
 *  
 * interfaces with HTML5 to implement looping functionality, supports start/end loop
 * 
 */
"use strict"

import * as map from './resource_map.js'
import * as input from '../input.js'

const FPS = 60; // Frames per second
const MPF = 1000 / FPS; // Milliseconds per frame.

// Variables for timing gameloop.
let mPrevTime;
let mLagTime;

// The current loop state (running or should stop)
let mLoopRunning = false;
let mCurrentScene = null;
let mFrameID = -1;

// This function assumes it is sub-classed from MyGame
function loopOnce() {
    if (mLoopRunning) {
        // Step A: set up for next call to LoopOnce and update input!
        mFrameID = requestAnimationFrame(loopOnce);

        // Step B: now let's draw
        //         draw() MUST be called before update()
        //         as update() may stop the loop!
        mCurrentScene.draw();    

        // Step C: compute how much time has elapsed since  last loopOnce was executed
        let currentTime = Date.now();
        let elapsedTime = currentTime - mPrevTime;
        mPrevTime = currentTime;
        mLagTime += elapsedTime;

        // Step D: Make sure we update the game the appropriate number of times.
        //      Update only every Milliseconds per frame.
        //      If lag larger then update frames, update until caught up.
        while ((mLagTime >= MPF) && mLoopRunning) {
            input.update();
            mCurrentScene.update();      
            mLagTime -= MPF;
        }
    } 
}

async function start(scene) {
    if (mLoopRunning) {
        throw new Error("loop already running")
    }
    // Wait for any async requests before game-load
    await map.waitOnPromises();

    mCurrentScene = scene;
    mCurrentScene.load();
    await map.waitOnPromises();
    
    mCurrentScene.init();    
    mPrevTime = Date.now();
    mLagTime = 0.0;
    mLoopRunning = true;
    mFrameID = requestAnimationFrame(loopOnce);
}

function stop() {
    mLoopRunning = false;
    // make sure no more animation frames
    cancelAnimationFrame(mFrameID);
}

export {start, stop}