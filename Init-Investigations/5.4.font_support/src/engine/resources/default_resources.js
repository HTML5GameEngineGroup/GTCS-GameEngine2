"use strict"

import core from '../index.js'
import SimpleShader from '../shaders/simple_shader.js'
import TextureShader from '../shaders/texture_shader.js'
import SpriteShader from '../shaders/sprite_shader.js'
import * as map from '../core/internal/resource_map.js'

// Simple Shader
let kSimpleVS = "src/glsl_shaders/simple_vs.glsl";  // Path to the VertexShader 
let kSimpleFS = "src/glsl_shaders/simple_fs.glsl";  // Path to the simple FragmentShader
let mConstColorShader = null;

// Texture Shader
var kTextureVS = "src/glsl_shaders/texture_vs.glsl";  // Path to the VertexShader 
var kTextureFS = "src/glsl_shaders/texture_fs.glsl";  // Path to the texture FragmentShader
var mTextureShader = null;
var mSpriteShader = null;

// Default font
var kDefaultFont = "assets/fonts/system_default_font";

function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
    mTextureShader = new TextureShader(kTextureVS, kTextureFS);
    mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
}

// unload all resources
function cleanUp() {
    mConstColorShader.cleanUp();
    mTextureShader.cleanUp();
    mSpriteShader.cleanUp();

    core.text.unload(kSimpleVS);
    core.text.unload(kSimpleFS);
    core.text.unload(kTextureVS);
    core.text.unload(kTextureFS);

    core.font.unload(kDefaultFont);
}

function init() {
    let loadPromise = new Promise(
        async function (resolve) {
            await Promise.all([
                core.text.load(kSimpleVS),
                core.text.load(kSimpleFS),
                core.text.load(kTextureVS),
                core.text.load(kTextureFS),
                core.font.load(kDefaultFont)
            ]);
            resolve();
        }).then(
            function resolve() { createShaders(); }
        );
    map.pushPromise(loadPromise);
}

function getConstColorShader() { return mConstColorShader; }
function getTextureShader() { return mTextureShader; }
function getSpriteShader() { return mSpriteShader; }

// font
function getDefaultFontName() { return kDefaultFont; }

export {
    init, cleanUp,

    // default system font name: this is guaranteed to be loaded
    getDefaultFontName,

    // shaders
    getConstColorShader, getTextureShader, getSpriteShader
}