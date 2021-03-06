/* 
 * Implements a SimpleShader object.
 * 
 */
"use strict"

import * as text from '../resources/text.js'
import * as GLSys from '../core/internal/gl.js'
import * as vertexBuffer from '../core/internal/vertex_buffer.js'

class SimpleShader {

    // constructor of SimpleShader object
    constructor(vertexShaderPath, fragmentShaderPath) {
        // instance variables
        // Convention: all instance variables: mVariables
        this.mCompiledShaderProgram = null;  // reference to the compiled shader program in webgl context  
        this.mVertexPositionRef = null; // reference to SquareVertexPosition within the shader
        this.mPixelColorRef = null;  // reference to the pixelColor uniform in the fragment shader
        this.mModelMatrixRef = null; // reference to model transform matrix in vertex shader
        this.mCameraMatrixRef = null; // reference to the View/Projection matrix in the vertex shader

        let gl = GLSys.get();
        // start of constructor code
        // 
        // Step A: load and compile vertex and fragment shaders
        this.mVertexShader = compileShader(vertexShaderPath, gl.VERTEX_SHADER);
        this.mFragmentShader = compileShader(fragmentShaderPath, gl.FRAGMENT_SHADER);

        // Step B: Create and link the shaders into a program.
        this.mCompiledShaderProgram = gl.createProgram();
        gl.attachShader(this.mCompiledShaderProgram, this.mVertexShader);
        gl.attachShader(this.mCompiledShaderProgram, this.mFragmentShader);
        gl.linkProgram(this.mCompiledShaderProgram);

        // Step C: check for error
        if (!gl.getProgramParameter(this.mCompiledShaderProgram, gl.LINK_STATUS)) {
            throw new Error("Shader linking failed with [" + vertexShaderPath + " " + fragmentShaderPath +"].");
            return null;
        }

        // Step D: Gets a reference to the aSquareVertexPosition attribute within the shaders.
        this.mVertexPositionRef = gl.getAttribLocation(this.mCompiledShaderProgram, "aVertexPosition");

        // Step E: Gets references to the uniform variables: uPixelColor, uModelTransform, and uViewProjTransform
        this.mPixelColorRef = gl.getUniformLocation(this.mCompiledShaderProgram, "uPixelColor");
        this.mModelMatrixRef = gl.getUniformLocation(this.mCompiledShaderProgram, "uModelXformMatrix");
        this.mCameraMatrixRef = gl.getUniformLocation(this.mCompiledShaderProgram, "uCameraXformMatrix");
    }

    // Activate the shader for rendering
    activateShader(pixelColor, trsMatrix, cameraMatrix) {
        let gl = GLSys.get();
        gl.useProgram(this.mCompiledShaderProgram);

                // bind vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.get());
        gl.vertexAttribPointer(this.mVertexPositionRef,
            3,              // each element is a 3-float (x,y.z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        gl.enableVertexAttribArray(this.mVertexPositionRef);

        // load uniforms
        gl.uniform4fv(this.mPixelColorRef, pixelColor);
        gl.uniformMatrix4fv(this.mModelMatrixRef, false, trsMatrix);
        gl.uniformMatrix4fv(this.mCameraMatrixRef, false, cameraMatrix);
        
    }

    cleanUp() {
        let gl = GLSys.get();
        gl.detachShader(this.mCompiledShaderProgram, this.mVertexShader);
        gl.detachShader(this.mCompiledShaderProgram, this.mFragmentShader);
        gl.deleteShader(this.mVertexShader);
        gl.deleteShader(this.mFragmentShader);
        gl.deleteProgram(this.mCompiledShaderProgram);
    }
}

// 
// Returns a compiled shader from a shader in the dom.
// The id is the id of the script in the html tag.
function compileShader(filePath, shaderType) {
    let shaderSource = null, compiledShader = null;
    let gl = GLSys.get();

    // Step A: Access the shader textfile
    shaderSource = text.get(filePath);

    if (shaderSource === null) {
        throw new Error("Loading of:" + filePath + " Failed!");
        return null;
    }

    // Step B: Create the shader based on the shader type: vertex or fragment
    compiledShader = gl.createShader(shaderType);

    // Step C: Compile the created shader
    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    // Step D: check for errors and return results (null if error)
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        throw new Error("Shader ["+ filePath +"] compiling error: " + 
                gl.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
}

export default SimpleShader;