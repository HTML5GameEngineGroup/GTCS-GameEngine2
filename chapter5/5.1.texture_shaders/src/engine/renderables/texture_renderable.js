/*
 * File: texture_renderable.js
 *
 * Supports the drawing an entire file texture mapped onto an entire Renderable
 * 
 */
"use strict"

import Renderable from "./renderable.js"
import * as texture from "../resources/texture.js"
import * as defaultResources from "../resources/default_resources.js"

  // Operate in Strict mode such that letiables must be declared before used!

class TextureRenderable extends Renderable {
    constructor(myTexture) {
        super();
        super.setColor([1, 1, 1, 0]); // Alpha of 0: switch off tinting of texture
        super._setShader(defaultResources.getTextureShader());
        this.mTexture = myTexture;     // texture for this object, cannot be a null
    }

    draw(camera) {
        // activate the texture
        texture.activate(this.mTexture);
        super.draw(camera);
    }

    getTexture() { return this.mTexture; }
    setTexture(t) { this.mTexture = t; }
}

export default TextureRenderable;