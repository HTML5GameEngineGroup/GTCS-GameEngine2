/*
 * File: renderable.js
 *
 * Encapsulate the Shader and vertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */
"use strict";

import * as glSys from "../core/gl.js";
import Transform from "../transform.js";
import * as shaderResources from "../core/shader_resources.js";

class Renderable {
    // these are private variables
    #mXform;
    #mColor;

    constructor() {
        this._mShader = shaderResources.getConstColorShader();  // get the constant color shader
        this.#mXform = new Transform(); // transform that moves this object around
        this.#mColor = [1, 1, 1, 1];    // color of pixel
    }

    draw(camera) {
        let gl = glSys.get();
        this._mShader.activate(this.#mColor, this.#mXform.getTRSMatrix(), camera.getCameraMatrix());  // always activate the shader first!
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    getXform() { return this.#mXform; }
    setColor(color) { this.#mColor = color; }
    getColor() { return this.#mColor; }

    // note: function names with leading "_" is protected
    _setShader(s) {
        this._mShader = s;
    }
}

export default Renderable;