/*
 * File: light_renderable.js
 *  
 * SpriteAnimatedRenderable with light illumination
 */
"use strict";

import SpriteAnimateRenderable from "./sprite_animate_renderable.js";

// Operate in Strict mode such that variables must be declared before used!

class LightRenderable extends SpriteAnimateRenderable {

    constructor(myTexture) {
        super(myTexture);
        super._setShader(defaultResources.getLightShader());

        // here is the light source
        this.mLights = [];
    }

    draw(camera) {
        this.mShader.setLights(this.mLights);
        super.draw(camera);
    }

    getLightAt(index) {
        return this.mLights[index];
    }
    addLight(l) {
        this.mLights.push(l);
    }
}

export default LightRenderable;