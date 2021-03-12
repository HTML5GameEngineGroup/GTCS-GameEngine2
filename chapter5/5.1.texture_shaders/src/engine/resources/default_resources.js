/*
 * File: default_resources.js
 *
 * central storage of all engine-wide shared resources, e.g., shaders
 */
"use strict"

import core from '../index.js'
import SimpleShader from '../shaders/simple_shader.js'
import TextureShader from '../shaders/texture_shader.js'
import * as map from '../core/internal/resource_map.js'

// Simple Shader
let kSimpleVS = "src/glsl_shaders/simple_vs.glsl";  // Path to the VertexShader 
let kSimpleFS = "src/glsl_shaders/simple_fs.glsl";  // Path to the simple FragmentShader
let mConstColorShader = null;

// Texture Shader
let kTextureVS = "src/glsl_shaders/texture_vs.glsl";  // Path to the VertexShader 
let kTextureFS = "src/glsl_shaders/texture_fs.glsl";  // Path to the texture FragmentShader
let mTextureShader = null;

function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
    mTextureShader = new TextureShader(kTextureVS, kTextureFS);
}

// unload all resources
function cleanUp() {
    mConstColorShader.cleanUp();
    mTextureShader.cleanUp();

    core.text.unload(kSimpleVS);
    core.text.unload(kSimpleFS);
    core.text.unload(kTextureVS);
    core.text.unload(kTextureFS);
}

function init() {
    let loadPromise = new Promise(
        async function (resolve) {
            await Promise.all([
                core.text.load(kSimpleVS),
                core.text.load(kSimpleFS),
                core.text.load(kTextureVS),
                core.text.load(kTextureFS)
            ]);
            resolve();
        }).then(
            function resolve() { createShaders(); }
        );
    map.pushPromise(loadPromise);
}

function getConstColorShader() { return mConstColorShader; }
function getTextureShader() { return mTextureShader; }


export {
    init, cleanUp,

    // shaders
    getConstColorShader, getTextureShader
}