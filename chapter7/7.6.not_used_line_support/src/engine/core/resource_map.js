/*
 * File: resource_map.js
 *  
 * base module for managing storage and synchronization of all resources
 * 
 */
"use strict";

let mMap = new Map();
let mOutstandingPromises = [];

function has(path) { return mMap.has(path) }

// returns the resource of path. An error to if path is not found
function get(path) {
    if (!has(path)) {
        throw new Error("Error [" + path + "]: not loaded");
    }
    return mMap.get(path);
}

// generic loading function, 
//   Step 1: fetch from server
//   Step 2: decodeResource on the loaded package
//   Step 3: parseResource on the decodedResource
//   Step 4: store result into the map
// Push the promised operation into an array
function loadDecodeParse(path, decodeResource, parseResource) {
    let fetchPromise = null;
    if (!has(path)) {
        fetchPromise =  fetch(path)
            .then(res => decodeResource(res) )
            .then(data => parseResource(data) )
            .then(data => { return mMap.set(path, data) } )
            .catch(err => { throw err });
        pushPromise(fetchPromise);
    }
    return fetchPromise;
}
function unload(path) { mMap.delete(path) }

function set(key, value) { mMap.set(key, value); }

function pushPromise(p) { mOutstandingPromises.push(p); }

// will block, wait for all oustanding promises complete
// before continue
async function waitOnPromises() {
    await Promise.all(mOutstandingPromises);
    mOutstandingPromises = []; // remove all
}

export {has, get, set, loadDecodeParse, unload, pushPromise, waitOnPromises}