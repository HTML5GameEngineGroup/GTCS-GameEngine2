/*
 * File: TextureRenderable.js
 *  
 * Renderable objects with textures
 */
// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as defaultResources from './Core/Resources/Engine_DefaultResources.js'
import * as textures from './Core/Resoruces/Engine_Texture.js'

import Renderable from './Renderable.js'

class TextureRenderable extends Renderable {
    constructor(myTexture) {
        super();
        setColor([1, 1, 1, 0]); // Alpha of 0: switch off tinting of texture
        setShader(defaultResources.mTextureShader);
        this.mTexture = myTexture;          // texture for this object, cannot be a "null"
    }
    
    draw(vpMatrix) {
        // activate the texture
        textures.activateTexture(this.mTexture);
        super.draw(vpMatrix);
    }

    getTexture() { return this.mTexture; };
    setTexture(t) { this.mTexture = t; };
};

export default TextureRenderable;