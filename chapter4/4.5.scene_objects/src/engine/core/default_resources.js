/*
 * File: default_resources.js
 *
 * central storage of all engine-wide shared resources, e.g., shaders
 */
"use strict"

import core from "../index.js";
import SimpleShader from "../shaders/simple_shader.js";
import TextureShader from "../shaders/texture_shader.js";
import SpriteShader from "../shaders/sprite_shader.js";
import LineShader from "../shaders/line_shader.js";
import LightShader from "../shaders/light_shader.js";
import IllumShader from "../shaders/illum_shader.js";
import * as map from "../core/internal/resource_map.js";

// Global Ambient color
let mGlobalAmbientColor = [0.3, 0.3, 0.3, 1];
let mGlobalAmbientIntensity = 1;
function getGlobalAmbientIntensity() { return mGlobalAmbientIntensity; };
function setGlobalAmbientIntensity(v) { mGlobalAmbientIntensity = v; };
function getGlobalAmbientColor() { return mGlobalAmbientColor; };
function setGlobalAmbientColor(v) { mGlobalAmbientColor = vec4.fromValues(v[0], v[1], v[2], v[3]); };

// Simple Shader
let kSimpleVS = "src/glsl_shaders/simple_vs.glsl";  // Path to the VertexShader 
let kSimpleFS = "src/glsl_shaders/simple_fs.glsl";  // Path to the simple FragmentShader
let mConstColorShader = null;

// Texture Shader
let kTextureVS = "src/glsl_shaders/texture_vs.glsl";  // Path to the VertexShader 
let kTextureFS = "src/glsl_shaders/texture_fs.glsl";  // Path to the texture FragmentShader
let mTextureShader = null;
let mSpriteShader = null;

// Line Shader
let kLineFS = "src/glsl_shaders/line_fs.glsl";        // Path to the Line FragmentShader
let mLineShader = null;


// Light Shader
let kLightFS = "src/glsl_shader/light_fs.glsl";  // Path to the Light FragmentShader
let mLightShader = null;

// Illumination Shader
let kIllumFS = "src/glsl_shader/illum_fs.glsl";  // Path to the Illumination FragmentShader
let mIllumShader = null;

// Default font
let kDefaultFont = "assets/fonts/system_default_font";

function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
    mTextureShader = new TextureShader(kTextureVS, kTextureFS);
    mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
    mLineShader =  new LineShader(kSimpleVS, kLineFS);
    mLightShader = new LightShader(kTextureVS, kLightFS);
    mIllumShader = new IllumShader(kTextureVS, kIllumFS);
}

// unload all resources
function cleanUp() {
    mConstColorShader.cleanUp();
    mTextureShader.cleanUp();
    mSpriteShader.cleanUp();
    mLineShader.cleanUp();
    mLightShader.cleanUp();
    mIllumShader.cleanUp();

    core.text.unload(kSimpleVS);
    core.text.unload(kSimpleFS);
    core.text.unload(kTextureVS);
    core.text.unload(kTextureFS);
    core.text.unload(kLineFS);
    core.text.unload(kLightFS);
    core.text.unload(kIllumFS);

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
                core.text.load(kLineFS),
                core.text.load(kLightFS),
                core.text.load(kIllumFS),
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
function getLineShader() { return mLineShader; }
function getLightShader() { return mLightShader; };
function getIllumShader() { return mIllumShader; };

// font
function getDefaultFontName() { return kDefaultFont; }

export {
    init, cleanUp,

    // default system font name: this is guaranteed to be loaded
    getDefaultFontName,

    // shaders
    getConstColorShader, getTextureShader, getSpriteShader, getLineShader, getLightShader, getIllumShader,

    // Global ambient: intensity and color
    getGlobalAmbientColor, setGlobalAmbientColor, 
    getGlobalAmbientIntensity, setGlobalAmbientIntensity
}