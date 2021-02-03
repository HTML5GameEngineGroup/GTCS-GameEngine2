"use strict"

import * as map from '../internal/resource_map.js';

function has(path) { return map.has(path) }

function get(path) { return map.get(path); }

function unload(path) { map.unload(path) }

function load(path) {
    let r = null;
    if (!has(path)) {
        r =  fetch(path)
            .then(res => res.text())
            .then(data => { return map.set(path, data) } )
            .catch(err => { throw err });
        map.pushPromise(r);
    }
    return r;
}

export {has, get, load, unload}