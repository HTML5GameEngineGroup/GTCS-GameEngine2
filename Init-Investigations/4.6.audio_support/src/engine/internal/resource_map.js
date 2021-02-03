"use strict"

let mMap = new Map();
let mOutstandingPromise = [];

function has(path) { return mMap.has(path) }

function get(path) {
    if (!has(path)) {
        throw new Error("Error [" + path + "]: not loaded")
    }
    return mMap.get(path);
};

function unload(path) { mMap.delete(path) }

function set(key, value) { mMap.set(key, value); }

function pushPromise(p) { mOutstandingPromise.push(p); }

async function waitOnPromise() {
    console.log("OutstandingPromise:");
    console.log(mOutstandingPromise);
    await Promise.all(mOutstandingPromise);
    mOutstandingPromise = []; // remove all
}

export {has, get, set, unload, pushPromise, waitOnPromise}