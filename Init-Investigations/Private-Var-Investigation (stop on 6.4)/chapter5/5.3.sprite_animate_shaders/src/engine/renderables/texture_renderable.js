/*
 * File: texture_renderable.js
 *
 * Supports the drawing an entire file texture mapped onto an entire Renderable
 * 
 */
"use strict";

import Renderable from "./renderable.js";
import * as texture from "../resources/texture.js";
import * as shaderResources from "../core/shader_resources.js";

class TextureRenderable extends Renderable {  
    constructor(myTexture) {
        super();
        super.setColor([1, 1, 1, 0]); // Alpha of 0: switch off tinting of texture
        super._setShader(shaderResources.getTextureShader());
        this._mTexture = myTexture;  // texture for this object, cannot be a "null"
    }

    draw(camera) {
        // activate the texture
        texture.activate(this._mTexture);
        super.draw(camera);
    }

    getTexture() { return this._mTexture; }
    setTexture(newTexture) {
        this._mTexture = newTexture;
    }
}

export default TextureRenderable;