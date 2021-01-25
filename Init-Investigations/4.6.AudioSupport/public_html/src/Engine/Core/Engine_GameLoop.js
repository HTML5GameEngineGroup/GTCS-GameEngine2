/*
 * File: EngineCore_Loop.js 
 * Implements the game loop functionality of gEngine
 */
/*jslint node: true, vars: true */
/*global gEngine: false, requestAnimationFrame: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as map from './Resources/Engine_ResourceMap.js';
import * as input from './Engine_Input.js'
import Scene from '../Scene.js';

const kFPS = 60; // Frames per second
const kMPF = 1000 / kFPS; // Milliseconds per frame.

// Variables for timing gameloop.
let mPreviousTime = Date.now();
let mLagTime;
// The current loop state (running or should stop)
let mIsLoopRunning = false;
let mCurrentGame = null;

// This function assumes it is sub-classed from MyGame
function LoopOnce() {
    if (mIsLoopRunning) {
        // Step A: set up for next call to LoopOnce and update input!
        requestAnimationFrame(function () {
            LoopOnce();
        });

        // Step B: compute how much time has elapsed since we last LoopOnce was executed
        var currentTime = Date.now();
        var elapsedTime = currentTime - mPreviousTime;
        mPreviousTime = currentTime;
        mLagTime += elapsedTime;

        // Step C: Make sure we update the game the appropriate number of times.
        //      Update only every Milliseconds per frame.
        //      If lag larger then update frames, update until caught up.
        while ((mLagTime >= kMPF) && mIsLoopRunning) {
            input.update();
            mCurrentGame.update();      
            mLagTime -= kMPF;
        }
        // Step D: now let's draw
        mCurrentGame.draw();    
    } else {
        // this scene is done, unload it!
        mCurrentGame.unloadScene();
    }
};

// update and draw functions must be set before this.
function initLoop () {
    // Step A: reset frame time 
    mPreviousTime = Date.now();
    mLagTime = 0.0;

    // Step B: remember that loop is now running
    mIsLoopRunning = true;

    // Step C: request LoopOnce to run when loading is done
    requestAnimationFrame(function () {
        LoopOnce();
    });
};

function startGameLoop(myGame) {
    mCurrentGame = myGame;
    map.setLoadCompleteCallback(
            function () {
                mCurrentGame.init();
                initLoop();
            }
    );
};

function stopGameLoop() {
    mIsLoopRunning = false;
};

export {startGameLoop as startLoop, 
        stopGameLoop as stopLoop};

