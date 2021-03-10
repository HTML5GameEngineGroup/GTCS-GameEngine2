"use strict"

let mMap = new Map();
let mOutstandingPromises = [];

function has(path) { return mMap.has(path) }

function get(path) {
    if (!has(path)) {
        throw new Error("Error [" + path + "]: not loaded");
    }
    return mMap.get(path);
}


function loadDecodeParse(path, decodeResource, parseResource) {
    let r = null;
    if (!has(path)) {
        r =  fetch(path)
            .then(res => decodeResource(res) )
            .then(data => parseResource(data) )
            .then(data => { return mMap.set(path, data) } )
            .catch(err => { throw err });
        pushPromise(r);
    }
    return r;
}

function unload(path) { mMap.delete(path) }

function set(key, value) { mMap.set(key, value); }

function pushPromise(p) { mOutstandingPromises.push(p); }

async function waitOnPromises() {
    await Promise.all(mOutstandingPromises);
    mOutstandingPromises = []; // remove all
}

export {has, get, set, loadDecodeParse, unload, pushPromise, waitOnPromises}