/* 
 * File: SimpleShader.js
 * 
 * Implements a SimpleShader object.
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as core from './Engine_Core.js';
import * as vertexBuffer from './Engine_VertexBuffer.js';

class SimpleShader {

    //<editor-fold desc="constructor">
    // constructor of SimpleShader object
    constructor(vertexShaderPath, fragmentShaderPath) {
        // instance variables
        // Convention: all instance variables: mVariables
        this.mCompiledShader = null;  // reference to the compiled shader in webgl context  
        this.mVertexPosition = null; // reference to VertexPosition within the shader
        this.mPixelColor = null;                    // reference to the pixelColor uniform in the fragment shader

        // start of constructor code
        // 
        // Step A: load and compile vertex and fragment shaders
        this.mVertexShader = loadAndCompileShader(vertexShaderPath, core.gGL.VERTEX_SHADER);
        this.mFragmentShader = loadAndCompileShader(fragmentShaderPath, core.gGL.FRAGMENT_SHADER);

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

        // Step D: Gets a reference to the aVertexPosition attribute within the shaders.
        this.mVertexPosition = core.gGL.getAttribLocation(
            this.mCompiledShader, "aVertexPosition");

        // Step E: Gets a reference to the uniform variable uPixelColor in the fragment shader
        this.mPixelColor = core.gGL.getUniformLocation(this.mCompiledShader, "uPixelColor");
    }
    //</editor-fold>


    // <editor-fold desc="Public Methods">
    // Activate the shader for rendering
    activateShader(pixelColor) {
        core.gGL.useProgram(this.mCompiledShader);
        core.gGL.bindBuffer(core.gGL.ARRAY_BUFFER, vertexBuffer.mGLVertexBuffer);
        core.gGL.vertexAttribPointer(this.mVertexPosition,
            3,              // each element is a 3-float (x,y.z)
            core.gGL.FLOAT,      // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        core.gGL.enableVertexAttribArray(this.mVertexPosition);
        core.gGL.uniform4fv(this.mPixelColor, pixelColor);
    }
    //-- end of public methods
    // </editor-fold>
};

// <editor-fold desc="Private Methods">
//**-----------------------------------
// Private methods not mean to call by outside of this object
// **------------------------------------

// 
// Returns a compiled shader from a shader in the dom.
// The id is the id of the script in the html tag.
function loadAndCompileShader(filePath, shaderType) {
    var xmlReq, shaderSource = null, compiledShader = null;

    // Step A: Request the text from the given file location.
    xmlReq = new XMLHttpRequest();
    xmlReq.open('GET', filePath, false);
    try {
        xmlReq.send();
    } catch (error) {
        alert("Failed to load shader: " + filePath + " [Hint: you cannot double click index.html to run this project. " +
                "The index.html file must be loaded by a web-server.]");
        return null;
    }
    shaderSource = xmlReq.responseText;

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
//-- end of private methods
//</editor-fold>

export default SimpleShader;