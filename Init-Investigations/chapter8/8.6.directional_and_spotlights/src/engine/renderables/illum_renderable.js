/*
 * File: illum_renderable.js
 *  
 * LightRenderable with light illumination
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import texture from "../resources/texture.js";
import LightRenderable from "./light_renderable.js";
import Material from "../material.js";

class IllumRenderable extends LightRenderable {
    constructor(myTexture, myNormalMap) {
        super(myTexture);
        super._setShader(defaultResources.getIllumShader());

        // here is the normal map resource id
        this.mNormalMap = myNormalMap;

        // Normal map texture coordinate will reproduce the corresponding sprite sheet
        // This means, the normal map MUST be based on the sprite sheet

        // Material for this Renderable
        this.mMaterial = new Material();
    }

    //**-----------------------------------------
    // Public methods
    //**-----------------------------------------
    draw(camera) {
        texture.activate(this.mNormalMap, true);
        // Here thenormal map texture coordinate is copied from those of 
        // the corresponding sprite sheet
        this.mShader.setMaterialAndCameraPos(this.mMaterial, camera.getWCCenterInPixelSpace());
        super.draw(camera);
    }

    getMaterial() { return this.mMaterial; }
}

export default IllumRenderable;