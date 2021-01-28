/*
 * File: EngineCore_Input.js 
 * Provides input support
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// Key code constants
let kKeys = {
    // arrows
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,

    // space bar
    Space: 32,

    // numbers 
    Zero: 48,
    One: 49,
    Two: 50,
    Three: 51,
    Four: 52,
    Five : 53,
    Six : 54,
    Seven : 55,
    Eight : 56,
    Nine : 57,

    // Alphabets
    A : 65,
    D : 68,
    E : 69,
    F : 70,
    G : 71,
    I : 73,
    J : 74,
    K : 75,
    L : 76,
    R : 82,
    S : 83,
    T : 84,
    U : 85,
    V : 86,
    W : 87,
    X : 88,      
    Y : 89,
    Z : 90,

    LastKeyCode: 222
};

// Previous key state
let mKeyPreviousState = []; // a new array
// The pressed keys.
let  mIsKeyPressed = [];
// Click events: once an event is set, it will remain there until polled
let  mIsKeyClicked = [];
// Event handler functions
function onKeyDown(event) {
    mIsKeyPressed[event.keyCode] = true;
};
function onKeyUp(event) {
    mIsKeyPressed[event.keyCode] = false;
};

function initInput() {
    let i;
    for (i = 0; i < kKeys.LastKeyCode; i++) {
        mIsKeyPressed[i] = false;
        mKeyPreviousState[i] = false;
        mIsKeyClicked[i] = false;
    }

    // register handlers 
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);
};

function updateInput() {
    let i;
    for (i = 0; i < kKeys.LastKeyCode; i++) {
        mIsKeyClicked[i] = (!mKeyPreviousState[i]) && mIsKeyPressed[i];
        mKeyPreviousState[i] = mIsKeyPressed[i];
    }
};
// Function for GameEngine programmer to test if a key is pressed down
function isKeyPressed(keyCode) {
    return mIsKeyPressed[keyCode];
};

function isKeyClicked(keyCode) {
    return (mIsKeyClicked[keyCode]);
};

export {initInput as init, 
        updateInput as update, 
        isKeyPressed, isKeyClicked, kKeys};