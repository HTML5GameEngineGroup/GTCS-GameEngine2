/*
 * File: renderable.js
 *
 * Encapsulate the Shader and VertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */
"use strict"

import * as GLSys from "./core/gl.js";
import * as Shaders from "./core/shader_resources.js";

class Renderable {
    constructor() {
        this.mShader = Shaders.getConstColorShader();   // the shader for shading this object
        this.mColor = [1, 1, 1, 1];    // color of pixel
    }

    draw() {
        let gl = GLSys.get();
        this.mShader.activate(this.mColor);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    
    setColor(color) { this.mColor = color; }
    getColor() { return this.mColor; }
}

export default Renderable;