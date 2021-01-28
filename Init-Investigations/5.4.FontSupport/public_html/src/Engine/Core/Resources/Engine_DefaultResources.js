/*
 * File: Engine_DefaultResources.js 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import SimpleShader from '../../SimpleShader.js';
import * as textFileLoader from './Engine_TextFileLoader.js';  // textFile_ functions
import * as map from './Engine_ResourceMap.js'
import * as font from './Engine_Fonts.js'
    
    // Simple Shader
let kSimpleVS = "src/GLSLShaders/SimpleVS.glsl";  // Path to the VertexShader 
let kSimpleFS = "src/GLSLShaders/SimpleFS.glsl";  // Path to the simple FragmentShader

let mConstColorShader = null;

// Texture Shader
let kTextureVS = "src/GLSLShaders/TextureVS.glsl";  // Path to the VertexShader 
let kTextureFS = "src/GLSLShaders/TextureFS.glsl";  // Path to the texture FragmentShader
let mTextureShader = null;
let mSpriteShader = null;

// Default font
let kDefaultFont = "assets/fonts/system-default-font";


function createShaders(callBackFunction) {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
    mTextureShader = new TextureShader(kTextureVS, kTextureFS);
    mSpriteShader =  new SpriteShader(kTextureVS, kTextureFS);
    callBackFunction();
};

function initialize(callBackFunction) {
    // constant color shader: SimpleVS, and SimpleFS
    textFileLoader.loadTextFile(kSimpleVS, textFileLoader.eTextFileType.eTextFile);
    textFileLoader.loadTextFile(kSimpleFS, textFileLoader.eTextFileType.eTextFile);

    // texture shader: 
    textFileLoader.loadTextFile(kTextureVS, textFileLoader.eTextFileType.eTextFile);
    textFileLoader.loadTextFile(kTextureFS, textFileLoader.eTextFileType.eTextFile);

    // load default font
    fonts.loadFont(kDefaultFont);

    map.setLoadCompleteCallback(
                function() { createShaders(callBackFunction);}
            );
};

// unload all resources
function cleanUp() {
    mConstColorShader.cleanUp();
    mTextureShader.cleanUp();
    mSpriteShader.cleanUp();

    textFileLoader.unloadTextFile(kSimpleVS);
    textFileLoader.unloadTextFile(kSimpleFS);

     // texture shader: 
     textFileLoader.unloadTextFile(kTextureVS);
     textFileLoader.unloadTextFile(kTextureFS);

     // default font
     fonts.unloadFont(kDefaultFont);
};

export {
    initialize as init,
    cleanUp as cleanUp,
    mConstColorShader,
    mTextureShader,
    mSpriteShader,
    kDefaultFont        
};