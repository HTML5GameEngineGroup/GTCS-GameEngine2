let map = new Map();
let audioCtx = null;
let bgAudioNode = null;

export function init() {
    try {
        let AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    } catch (e) {
        alert("Web Audio Is not supported.");
    }
}

export async function load(path) {
    if (map.has(path)) return;
    let res = await fetch(path)
    let buffer = await res.arrayBuffer()
    let data = await audioCtx.decodeAudioData(buffer)
    map.set(path, data)
}

export function unload(path) { map.delete(path) }

export function playCue(path) {
    if (!map.has(path)) {
        throw new Error("can't get audio synchronously, not loaded")
    }        // SourceNodes are one use only.

    let sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = map.get(path);
    sourceNode.connect(audioCtx.destination);
    sourceNode.start(0);

};

export function playBG(path) {
    if (!map.has(path)) {
        throw new Error("can't get audio synchronously, not loaded")
    }
    stopBG();
    bgAudioNode = audioCtx.createBufferSource();
    bgAudioNode.buffer = map.get(path);
    bgAudioNode.connect(audioCtx.destination);
    bgAudioNode.loop = true;
    bgAudioNode.start(0);
};

export function stopBG() {
    if (bgAudioNode !== null) {
        bgAudioNode.stop(0);
        bgAudioNode = null;
    }
};

export function isBGPlaying() {
    return (bgAudioNode !== null);
};
