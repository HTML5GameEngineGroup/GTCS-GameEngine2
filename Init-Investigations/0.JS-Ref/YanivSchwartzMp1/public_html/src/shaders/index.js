
import { gl } from '../gl/index.js'

class Shaders {
    constructor(vertexShaderPath, fragmentShaderPath) {
        this.mCompiledShader = null; 
        this.mShaderVertexPositionAttribute = null; 
        this.mPixelColorRef = null;

        let vertexShader = loadAndCompileShader(vertexShaderPath, gl.VERTEX_SHADER);
        let fragmentShader = loadAndCompileShader(fragmentShaderPath, gl.FRAGMENT_SHADER);

        this.mCompiledShader = gl.createProgram();
        gl.attachShader(this.mCompiledShader, vertexShader);
        gl.attachShader(this.mCompiledShader, fragmentShader);
        gl.linkProgram(this.mCompiledShader);

        if (!gl.getProgramParameter(this.mCompiledShader, gl.LINK_STATUS)) {
            throw new Error("Error linking shader");
        }

        this.mShaderVertexPositionAttribute = gl.getAttribLocation(
            this.mCompiledShader, "aSquareVertexPosition");

        gl.vertexAttribPointer(this.mShaderVertexPositionAttribute,
            3,              // each element is a 3-float (x,y.z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element

        
        this.mPixelColorRef = gl.getUniformLocation(this.mCompiledShader, "uPixelColor");
        this.mScale = gl.getUniformLocation(this.mCompiledShader, "uScale");
        this.mOffset = gl.getUniformLocation(this.mCompiledShader, "uOffset");
    }

    activate(pixelColor, scaleX, scaleY, offsetX, offsetY) {
        gl.useProgram(this.mCompiledShader);
        gl.vertexAttribPointer(this.mShaderVertexPositionAttribute,
            3,              // each element is a 3-float (x,y.z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
        gl.uniform4fv(this.mPixelColorRef, pixelColor);
        gl.uniform2f(this.mScale, scaleX, scaleY);
        gl.uniform2f(this.mOffset, offsetX, offsetY);
    }
}

function loadAndCompileShader(filePath, shaderType) {
    let xmlReq, shaderSource = null, compiledShader = null;

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
    compiledShader = gl.createShader(shaderType);

    // Step C: Compile the created shader
    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    // Step D: check for errors and return results (null if error)
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        alert("A shader compiling error occurred: " + gl.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
}

export default Shaders