/* 
 * File: SimpleShader.js
 * 
 * Implements a SimpleShader object.
 * 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as map from './Core/Resources/Engine_ResourceMap.js';
import * as core from './Core/Engine_Core.js';
import * as vertexBuffer from './Core/Engine_VertexBuffer.js';

class SimpleShader {

    // constructor of SimpleShader object
    constructor(vertexShaderPath, fragmentShaderPath) {
        // instance variables
        // Convention: all instance variables: mVariables
        this.mCompiledShader = null;  // reference to the compiled shader in webgl context  
        this.mVertexPosition = null; // reference to SquareVertexPosition within the shader
        this.mPixelColor = null;                    // reference to the pixelColor uniform in the fragment shader
        this.mModelTransform = null;                // reference to model transform matrix in vertex shader
        this.mViewProjTransform = null;             // reference to the View/Projection matrix in the vertex shader

        // start of constructor code
        // 
        // Step A: load and compile vertex and fragment shaders
        this.mVertexShader = compileShader(vertexShaderPath, core.gGL.VERTEX_SHADER);
        this.mFragmentShader = compileShader(fragmentShaderPath, core.gGL.FRAGMENT_SHADER);

        // Step B: Create and link the shaders into a program.
        this.mCompiledShader = core.gGL.createProgram();
        core.gGL.attachShader(this.mCompiledShader, this.mVertexShader);
        core.gGL.attachShader(this.mCompiledShader, this.mFragmentShader);
        core.gGL.linkProgram(this.mCompiledShader);

        // Step C: check for error
        if (!core.gGL.getProgramParameter(this.mCompiledShader, core.gGL.LINK_STATUS)) {
            alert("Error linking shader");
            return null;
        }

        // Step D: Gets a reference to the aSquareVertexPosition attribute within the shaders.
        this.mVertexPosition = core.gGL.getAttribLocation(
            this.mCompiledShader, "aVertexPosition");

        // Step E: Gets references to the uniform variables: uPixelColor, uModelTransform, and uViewProjTransform
        this.mPixelColor = core.gGL.getUniformLocation(this.mCompiledShader, "uPixelColor");
        this.mModelTransform = core.gGL.getUniformLocation(this.mCompiledShader, "uModelTransform");
        this.mViewProjTransform = core.gGL.getUniformLocation(this.mCompiledShader, "uViewProjTransform");
    }

    // Activate the shader for rendering
    activateShader(pixelColor, vpMatrix) {
        core.gGL.useProgram(this.mCompiledShader);
        core.gGL.uniformMatrix4fv(this.mViewProjTransform, false, vpMatrix);
        core.gGL.bindBuffer(core.gGL.ARRAY_BUFFER, vertexBuffer.mGLVertexBuffer);
        core.gGL.vertexAttribPointer(this.mVertexPosition,
            3,              // each element is a 3-float (x,y.z)
            core.gGL.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        core.gGL.enableVertexAttribArray(this.mVertexPosition);
        core.gGL.uniform4fv(this.mPixelColor, pixelColor);
    };

    // Loads per-object model transform to the vertex shader
    loadObjectTransform(modelTransformMatrix) {
            // loads the modelTransform matrix into webGL to be used by the vertex shader
        core.gGL.uniformMatrix4fv(this.mModelTransform, false, modelTransformMatrix);
    };
    
    cleanUp() {
        core.gGL.detachShader(this.mCompiledShader, this.mVertexShader);
        core.gGL.detachShader(this.mCompiledShader, this.mFragmentShader);
        core.gGL.deleteShader(this.mVertexShader);
        core.gGL.deleteShader(this.mFragmentShader);
   }
}

// 
// Returns a compiled shader from a shader in the dom.
// The id is the id of the script in the html tag.
function compileShader(filePath, shaderType) {
    var shaderSource = null, compiledShader = null;

    // Step A: Access the shader textfile
    shaderSource = map.retrieveAsset(filePath);

    if (shaderSource === null) {
        alert("WARNING: Loading of:" + filePath + " Failed!");
        return null;
    }

    // Step B: Create the shader based on the shader type: vertex or fragment
    compiledShader = core.gGL.createShader(shaderType);

    // Step C: Compile the created shader
    core.gGL.shaderSource(compiledShader, shaderSource);
    core.gGL.compileShader(compiledShader);

    // Step D: check for errors and return results (null if error)
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!core.gGL.getShaderParameter(compiledShader, core.gGL.COMPILE_STATUS)) {
        alert("A shader compiling error occurred: " + core.gGL.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
};

export default SimpleShader;