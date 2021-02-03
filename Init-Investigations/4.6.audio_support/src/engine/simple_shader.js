/* 
 * Implements a SimpleShader object.
 * 
 */
"use strict"

import * as text from './resources/text.js';
import * as gl from './internal/gl.js';
import * as vertexBuffer from './internal/vertex_buffer.js'

class SimpleShader {

    // constructor of SimpleShader object
    constructor(vertexShaderPath, fragmentShaderPath) {
        // instance variables
        // Convention: all instance variables: mVariables
        this.mCompiledShader = null;  // reference to the compiled shader in webgl context  
        this.mVertexPositionRef = null; // reference to SquareVertexPosition within the shader
        this.mPixelColorRef = null;  // reference to the pixelColor uniform in the fragment shader
        this.mModelMatrixRef = null; // reference to model transform matrix in vertex shader
        this.mCameraMatrixRef = null; // reference to the View/Projection matrix in the vertex shader

        // start of constructor code
        // 
        // Step A: load and compile vertex and fragment shaders
        this.mVertexShader = compileShader(vertexShaderPath, gl.get().VERTEX_SHADER);
        this.mFragmentShader = compileShader(fragmentShaderPath, gl.get().FRAGMENT_SHADER);

        // Step B: Create and link the shaders into a program.
        this.mCompiledShader = gl.get().createProgram();
        gl.get().attachShader(this.mCompiledShader, this.mVertexShader);
        gl.get().attachShader(this.mCompiledShader, this.mFragmentShader);
        gl.get().linkProgram(this.mCompiledShader);

        // Step C: check for error
        if (!gl.get().getProgramParameter(this.mCompiledShader, gl.get().LINK_STATUS)) {
            alert("Error linking shader");
            return null;
        }

        // Step D: Gets a reference to the aSquareVertexPosition attribute within the shaders.
        this.mVertexPositionRef = gl.get().getAttribLocation(
            this.mCompiledShader, "aVertexPosition");

        // Step E: Gets references to the uniform variables: uPixelColor, uModelTransform, and uViewProjTransform
        this.mPixelColorRef = gl.get().getUniformLocation(this.mCompiledShader, "uPixelColor");
        this.mModelMatrixRef = gl.get().getUniformLocation(this.mCompiledShader, "uModelXformMatrix");
        this.mCameraMatrixRef = gl.get().getUniformLocation(this.mCompiledShader, "uCameraXformMatrix");
    }

    // Activate the shader for rendering
    activateShader(pixelColor, cameraMatrix) {
        gl.get().useProgram(this.mCompiledShader);
        gl.get().uniformMatrix4fv(this.mCameraMatrixRef, false, cameraMatrix);
        gl.get().bindBuffer(gl.get().ARRAY_BUFFER, vertexBuffer.get());
        gl.get().vertexAttribPointer(this.mVertexPositionRef,
            3,              // each element is a 3-float (x,y.z)
            gl.get().FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        gl.get().enableVertexAttribArray(this.mVertexPositionRef);
        gl.get().uniform4fv(this.mPixelColorRef, pixelColor);
    };

    // Loads per-object model transform to the vertex shader
    loadModelMatrix(modelTransformMatrix) {
            // loads the modelTransform matrix into webGL to be used by the vertex shader
        gl.get().uniformMatrix4fv(this.mModelMatrixRef, false, modelTransformMatrix);
    };
}

// 
// Returns a compiled shader from a shader in the dom.
// The id is the id of the script in the html tag.
function compileShader(filePath, shaderType) {
    var shaderSource = null, compiledShader = null;

    // Step A: Access the shader textfile
    shaderSource = text.get(filePath);

    if (shaderSource === null) {
        alert("WARNING: Loading of:" + filePath + " Failed!");
        return null;
    }

    // Step B: Create the shader based on the shader type: vertex or fragment
    compiledShader = gl.get().createShader(shaderType);

    // Step C: Compile the created shader
    gl.get().shaderSource(compiledShader, shaderSource);
    gl.get().compileShader(compiledShader);

    // Step D: check for errors and return results (null if error)
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!gl.get().getShaderParameter(compiledShader, gl.get().COMPILE_STATUS)) {
        alert("A shader compiling error occurred: " + gl.get().getShaderInfoLog(compiledShader));
    }

    return compiledShader;
};

export default SimpleShader;