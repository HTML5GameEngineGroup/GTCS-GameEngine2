"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as GLSys from '../core/internal/gl.js'
import TextureShader from './texture_shader.js'
import SimpleShader from './simple_shader.js'

class SpriteShader extends TextureShader {
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call TextureShader constructor

        this.mTexCoordBuffer = null; // this is the reference to gl buffer that contains the actual texture coordinate

        let initTexCoord = [
            1.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            0.0, 0.0
        ];

        let gl = GLSys.get();
        this.mTexCoordBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord), gl.DYNAMIC_DRAW);
                // DYNAMIC_DRAW: says buffer content may change!
    }

    _getTexCoordBuffer() {
        return this.mTexCoordBuffer;
    }
    
    setTextureCoordinate(texCoord) {
        let gl = GLSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(texCoord));
    }

    cleanUp() {
        let gl = GLSys.get();
        gl.deleteBuffer(this.mTexCoordBuffer);
        // now call super class's clean up ...
        super.cleanUp(this);
    }
}

export default SpriteShader;