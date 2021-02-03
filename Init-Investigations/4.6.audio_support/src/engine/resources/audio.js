"use strict"

import * as map from '../internal/resource_map.js';

function has(path) { return map.has(path) }
function unload(path) { map.unload(path) }

let mAudioContext = null;
let mBGAudioNode = null;

function init() {
    try {
        let AudioContext = window.AudioContext || window.webkitAudioContext;
        mAudioContext = new AudioContext();
    } catch (e) {
        alert("Web Audio Is not supported.");
    }
}

function load(path) {
    let r = null; 
    if (!has(path)) {
        r = fetch(path)
            .then(res => res.arrayBuffer())
            .then(arrayBuffer => mAudioContext.decodeAudioData(arrayBuffer))
            .then(data => map.set(path, data));    
        map.pushPromise(r);
    }
    return r;
}

function playCue(path) {
    let sourceNode = mAudioContext.createBufferSource();
    sourceNode.buffer = map.get(path);
    sourceNode.connect(mAudioContext.destination);
    sourceNode.start(0);
};

function playBG(path) {
    if (map.has(path)) {
        stopBG();
        mBGAudioNode = mAudioContext.createBufferSource();
        mBGAudioNode.buffer = map.get(path);
        mBGAudioNode.connect(mAudioContext.destination);
        mBGAudioNode.loop = true;
        mBGAudioNode.start(0);
    }
};

function stopBG() {
    if (mBGAudioNode !== null) {
        mBGAudioNode.stop(0);
        mBGAudioNode = null;
    }
};

function isBGPlaying() {
    return (mBGAudioNode !== null);
};

export {init, load, unload, 
        playCue, 
        playBG, stopBG, isBGPlaying
    };