let mMap = new Map();
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

async function load(path) {
    if (mMap.has(path)) return;
    let res = await fetch(path)
    let buffer = await res.arrayBuffer()
    let data = await mAudioContext.decodeAudioData(buffer)
    mMap.set(path, data)
}

function unload(path) { mMap.delete(path) }

function playCue(path) {
    if (!mMap.has(path)) {
        throw new Error("can't get audio synchronously, not loaded")
    }        // SourceNodes are one use only.

    let sourceNode = mAudioContext.createBufferSource();
    sourceNode.buffer = mMap.get(path);
    sourceNode.connect(mAudioContext.destination);
    sourceNode.start(0);

};

function playBG(path) {
    if (!mMap.has(path)) {
        throw new Error("can't get audio synchronously, not loaded")
    }
    stopBG();
    mBGAudioNode = mAudioContext.createBufferSource();
    mBGAudioNode.buffer = mMap.get(path);
    mBGAudioNode.connect(mAudioContext.destination);
    mBGAudioNode.loop = true;
    mBGAudioNode.start(0);
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