"use strict";  // Operate in Strict mode such that letiables must be declared before used!

import * as GLSys from '../internal/gl.js';
import * as vertexBuffer from '../internal/vertex_buffer.js'
import  SimpleShader from './simple_shader.js';

class TextureShader extends SimpleShader {
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor

        // reference to aTextureCoordinate within the shader
        this.mTextureCoordinateRef = null;

        // get the reference of aTextureCoordinate within the shader
        let gl = GLSys.get();
        this.mTextureCoordinateRef = gl.getAttribLocation(this.mCompiledShaderProgram, "aTextureCoordinate");
        this.mSamperRef = gl.getAttribLocation(this.mCompiledShaderProgram, "uSampler");
    }

    // Overriding the Activation of the shader for rendering
    activateShader(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class's activate
        super.activateShader(pixelColor, trsMatrix, cameraMatrix);

        // now our own functionality: enable texture coordinate array
        let gl = GLSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getTexCoordBuffer());
        gl.vertexAttribPointer(this.mTextureCoordinateRef, 2, gl.FLOAT, false, 0, 0);        
        gl.enableVertexAttribArray(this.mTextureCoordinateRef);        

        // bind uSampler to texture 0
        gl.uniform1i(this.mSamplerRef, 0);  // texture.activateTexture() binds to Texture0
    }

    _getTexCoordBuffer() {
        return vertexBuffer.getTexCoord();
    }
}

export default TextureShader;