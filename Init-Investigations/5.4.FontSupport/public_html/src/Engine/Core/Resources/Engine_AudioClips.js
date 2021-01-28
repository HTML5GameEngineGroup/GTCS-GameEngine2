/*
 * File: EngineCore_Audio.js 
 * Provides support for loading and unloading of Audio clips
 */

/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, SimpleShader: false, window: false, alert: false, XMLHttpRequest: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as map from './Engine_ResourceMap.js';
    // all the map_ functions

let mAudioContext = null;
let mBgAudioNode = null;

/*
 * Initializes the audio context to play sounds.
 */
function initAudioContext() {
    try {
        let AudioContext = window.AudioContext || window.webkitAudioContext;
        mAudioContext = new AudioContext();
    } catch (e) {
        alert("Web Audio Is not supported.");
    }
};

function loadAudio(clipName) {
    if (!(map.isAssetLoaded(clipName))) {
        // Update resources in load counter.
        map.asyncLoadRequested(clipName);

        // Asynchronously request the data from server.
        let req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if ((req.readyState === 4) && (req.status !== 200)) {
                alert(clipName + ": loading failed! [Hint: you cannot double click index.html to run this project. " +
                        "The index.html file must be loaded by a web-server.]");
            }
        };
        req.open('GET', clipName, true);
        // Specify that the request retrieves binary data.
        req.responseType = 'arraybuffer';

        req.onload = function () {
            // Asynchronously decode, then call the function in parameter.
            mAudioContext.decodeAudioData(req.response,
                    function (buffer) {
                        map.asyncLoadCompleted(clipName, buffer);
                    }
            );
        };
        req.send();
    } else {
        map.incAssetRefCount(clipName);
    }
};

function unloadAudio(clipName) {
    map.unloadAsset(clipName);
};

function playACue(clipName) {
    let clipInfo = map.retrieveAsset(clipName);
    if (clipInfo !== null) {
        // SourceNodes are one use only.
        let sourceNode = mAudioContext.createBufferSource();
        sourceNode.buffer = clipInfo;
        sourceNode.connect(mAudioContext.destination);
        sourceNode.start(0);
    }
};

function playBackgroundAudio(clipName) {
    let clipInfo = map.retrieveAsset(clipName);
    if (clipInfo !== null) {
        // Stop audio if playing.
        stopBackgroundAudio();

        mBgAudioNode = mAudioContext.createBufferSource();
        mBgAudioNode.buffer = clipInfo;
        mBgAudioNode.connect(mAudioContext.destination);
        mBgAudioNode.loop = true;
        mBgAudioNode.start(0);
    }
};

function stopBackgroundAudio() {
    // Check if the audio is  playing.
    if (mBgAudioNode !== null) {
        mBgAudioNode.stop(0);
        mBgAudioNode = null;
    }
};

function isBackgroundAudioPlaying() {
    return (mBgAudioNode !== null);
};

export {
    initAudioContext as init,
    loadAudio as load,
    unloadAudio as unload,
    playACue as playACue,
    
    playBackgroundAudio as playBackground,
    stopBackgroundAudio as stopBackground,
    isBackgroundAudioPlaying as isBackgroundPlaying
};