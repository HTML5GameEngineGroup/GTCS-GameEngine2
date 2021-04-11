/*
 * File: default_resources.js
 *
 * central storage of all engine-wide shared resources, e.g., shaders
 */
"use strict"

import * as font from "./font.js";
import SimpleShader from "../simple_shader.js";
import * as map from "../core/internal/resource_map.js";
 
 // Simple Shader
let kSimpleVS = "src/glsl_shaders/simple_vs.glsl";  // Path to the VertexShader 
let kSimpleFS = "src/glsl_shaders/simple_fs.glsl";  // Path to the simple FragmentShader
let mConstColorShader = null;

function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
 }

  // unload all resources
function cleanUp() {
    mConstColorShader.cleanUp();
    core.text.unload(kSimpleVS);
    core.text.unload(kSimpleFS);
}

function init() {
    let loadPromise = new Promise(
        async function(resolve) {
            await Promise.all([
                core.text.load(kSimpleFS),
                core.text.load(kSimpleVS)
            ]);
            resolve();
        }).then(
            function resolve() { createShaders(); }
        );
    map.pushPromise(loadPromise);
}

function getConstColorShader() { return mConstColorShader; }

export {init, cleanUp, getConstColorShader}