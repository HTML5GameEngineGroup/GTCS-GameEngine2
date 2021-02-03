"use strict"

 import core from './index.js'
 import SimpleShader from '../simple_shader.js'
 import * as resourceMap from '../internal/resource_map.js'
 
 // Simple Shader
 let kSimpleVS = "src/glsl_shaders/simple_vs.glsl";  // Path to the VertexShader 
 let kSimpleFS = "src/glsl_shaders/simple_fs.glsl";  // Path to the simple FragmentShader
 let mConstColorShader = null;

 function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
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
    resourceMap.pushPromise(loadPromise);
}

function getConstColorShader() { return mConstColorShader; }

export {init, createShaders, getConstColorShader};