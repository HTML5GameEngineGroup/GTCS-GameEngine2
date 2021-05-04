/*
 * File: texture_renderable_main.js
 *
 * To support source code readability, TextureRenderable  implementation is split into
 * several files with related functions in the same file.
 *    
 *         texture_renderable_main.js: main class definition
 *         texture_renderable_pixel_collision.js: all pixel collision related functions
 *         texture_renderable.js: for importing all symbols
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
        
        this._mTexture = null;
        // these two instance variables are to cache texture information
        // for supporting per-pixel accurate collision
        this._mTextureInfo = null;
        this.mColorArray = null; // this variable is local, but the "#" syntax does not support cross file sharing
        // defined for subclass to override
        this.mElmWidthPixels = 0;
        this.mElmHeightPixels = 0;
        this.mElmLeftIndex = 0;
        this.mElmBottomIndex = 0;

        this.setTexture(myTexture);     // texture for this object, cannot be a "null"
    }

    draw(camera) {
        // activate the texture
        texture.activate(this._mTexture);
        super.draw(camera);
    }

    getTexture() { return this._mTexture; }
    setTexture(newTexture) {
        this._mTexture = newTexture;
        // these two instance variables are to cache texture information
        // for supporting per-pixel accurate collision
        this._mTextureInfo = texture.get(newTexture);
        this.mColorArray = null;
        // defined for one sprite element for subclass to override
        // For texture_renderable, one sprite element is the entire texture
        this.mElmWidthPixels = this._mTextureInfo.mWidth;
        this.mElmHeightPixels = this._mTextureInfo.mHeight;
        this.mElmLeftIndex = 0;
        this.mElmBottomIndex = 0;
    }
}

export default TextureRenderable;