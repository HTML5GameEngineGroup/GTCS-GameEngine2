/*
 * File: Engine_DefaultResources.js 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import SimpleShader from '../../SimpleShader.js';
import * as textFileLoader from './Engine_TextFileLoader.js';  // textFile_ functions
import * as map from './Engine_ResourceMap.js'
    

    // Simple Shader
let kSimpleVS = "src/GLSLShaders/SimpleVS.glsl";  // Path to the VertexShader 
let kSimpleFS = "src/GLSLShaders/SimpleFS.glsl";  // Path to the simple FragmentShader

let mConstColorShader = null;

function createShaders(callBackFunction) {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
    callBackFunction();
};

function initialize(callBackFunction) {
    // constant color shader: SimpleVS, and SimpleFS
    textFileLoader.load(kSimpleVS, textFileLoader.eTextFileType.eTextFile);
    textFileLoader.load(kSimpleFS, textFileLoader.eTextFileType.eTextFile);

    map.setLoadCompleteCallback(
                function () { createShaders(callBackFunction);}
            );
};

// unload all resources
function cleanUp() {
    mConstColorShader.cleanUp();
    textFileLoader.unloadTextFile(kSimpleVS);
    textFileLoader.unloadTextFile(kSimpleFS);
}

// Public interface for this object. Anything not in here will
// not be accessable.
export {
    initialize as init,
    mConstColorShader
};