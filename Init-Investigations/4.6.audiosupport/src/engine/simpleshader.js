/* 
 * Implements a SimpleShader object.
 * 
 */

import * as text from './resources/text.js';
import core from './core/index.js';

class SimpleShader {

    // constructor of SimpleShader object
    constructor(vertexShaderPath, fragmentShaderPath) {
        // instance variables
        // Convention: all instance variables: mVariables
        this.compiledShader = null;  // reference to the compiled shader in webgl context  
        this.vertexPosition = null; // reference to SquareVertexPosition within the shader
        this.pixelColor = null;                    // reference to the pixelColor uniform in the fragment shader
        this.odelTransform = null;                // reference to model transform matrix in vertex shader
        this.viewProjTransform = null;             // reference to the View/Projection matrix in the vertex shader

        // start of constructor code
        // 
        // Step A: load and compile vertex and fragment shaders
        this.vertexShader = compileShader(vertexShaderPath, core.gl.get().VERTEX_SHADER);
        this.fragmentShader = compileShader(fragmentShaderPath, core.gl.get().FRAGMENT_SHADER);

        // Step B: Create and link the shaders into a program.
        this.compiledShader = core.gl.get().createProgram();
        core.gl.get().attachShader(this.compiledShader, this.vertexShader);
        core.gl.get().attachShader(this.compiledShader, this.fragmentShader);
        core.gl.get().linkProgram(this.compiledShader);

        // Step C: check for error
        if (!core.gl.get().getProgramParameter(this.compiledShader, core.gl.get().LINK_STATUS)) {
            alert("Error linking shader");
            return null;
        }

        // Step D: Gets a reference to the aSquareVertexPosition attribute within the shaders.
        this.vertexPosition = core.gl.get().getAttribLocation(
            this.compiledShader, "aVertexPosition");

        // Step E: Gets references to the uniform variables: uPixelColor, uModelTransform, and uViewProjTransform
        this.pixelColor = core.gl.get().getUniformLocation(this.compiledShader, "uPixelColor");
        this.modelTransform = core.gl.get().getUniformLocation(this.compiledShader, "uModelTransform");
        this.viewProjTransform = core.gl.get().getUniformLocation(this.compiledShader, "uViewProjTransform");
    }

    // Activate the shader for rendering
    activateShader(pixelColor, vpMatrix) {
        core.gl.get().useProgram(this.compiledShader);
        core.gl.get().uniformMatrix4fv(this.viewProjTransform, false, vpMatrix);
        core.gl.get().bindBuffer(core.gl.get().ARRAY_BUFFER, core.vertexbuffer.get());
        core.gl.get().vertexAttribPointer(this.vertexPosition,
            3,              // each element is a 3-float (x,y.z)
            core.gl.get().FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        core.gl.get().enableVertexAttribArray(this.vertexPosition);
        core.gl.get().uniform4fv(this.pixelColor, pixelColor);
    };

    // Loads per-object model transform to the vertex shader
    loadObjectTransform(modelTransformMatrix) {
            // loads the modelTransform matrix into webGL to be used by the vertex shader
        core.gl.get().uniformMatrix4fv(this.modelTransform, false, modelTransformMatrix);
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
    compiledShader = core.gl.get().createShader(shaderType);

    // Step C: Compile the created shader
    core.gl.get().shaderSource(compiledShader, shaderSource);
    core.gl.get().compileShader(compiledShader);

    // Step D: check for errors and return results (null if error)
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!core.gl.get().getShaderParameter(compiledShader, core.gl.get().COMPILE_STATUS)) {
        alert("A shader compiling error occurred: " + core.gl.get().getShaderInfoLog(compiledShader));
    }

    return compiledShader;
};

export default SimpleShader;