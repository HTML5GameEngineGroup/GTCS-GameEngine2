/* 
 * File: light_shader.js
 *      Subclass from SpriteShader
 *      Supports light illumination
 */
"use strict";

import SpriteShader from "./sprite_shader.js";
import ShaderLightAt from "./shader_light_at.js";

class LightShader extends SpriteShader {
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call super class constructor

        this.mLights = null;  // lights from the Renderable

        //*******WARNING***************
        // this number MUST correspond to the GLSL uLight[] array size (for LightFS.glsl and IllumFS.glsl)
        //*******WARNING********************
        this.kGLSLuLightArraySize = 4;  // <-- make sure this is the same as LightFS.glsl and IllumFS.glsl
        this.mShaderLights = [];
        let i, ls;
        for (i = 0; i < this.kGLSLuLightArraySize; i++) {
            ls = new ShaderLightAt(this.mCompiledShader, i);
            this.mShaderLights.push(ls);
        }
    }

    // Overriding the Activation of the shader for rendering
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class's activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);

        // now push the light information to the shader
        let numLight = 0;
        if (this.mLights !== null) {
            while (numLight < this.mLights.length) {
                this.mShaderLights[numLight].loadToShader(aCamera, this.mLights[numLight]);
                numLight++;
            }
        }
        // switch off the left over ones.
        while (numLight < this.kGLSLuLightArraySize) {
            this.mShaderLights[numLight].switchOffLight(); // switch off unused lights
            numLight++;
        }
    }

    setLights(l) {
        this.mLights = l;
    }
}

export default LightShader;