/*
 * File: Renderable.js
 *  
 * Encapsulate the Shader and VertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as core from './Core/Engine_Core.js';
import * as defaultResource from './Core/Resources/Engine_DefaultResources.js'
import SimpleShader from './SimpleShader.js'
import Transform from './Transform.js'

class Renderable {
    constructor() {
        this.mShader = defaultResource.mConstantColorShader; // the shader for shading this object
        this.mXform = new Transform(); // transform that moves this object around
        this.mColor = [1, 1, 1, 1];    // color of pixel
    };

    //**-----------------------------------------
    // Public methods
    //**-----------------------------------------
    draw(vpMatrix) {
        this.mShader.activateShader(this.mColor, vpMatrix);  // always activate the shader first!
        this.mShader.loadObjectTransform(this.mXform.getTRS());
        core.gGL.drawArrays(core.gGL.TRIANGLE_STRIP, 0, 4);
    };
    
    getXform() { return this.mXform; };
    
    setColor(color) { this.mColor = color; };
    getColor() { return this.mColor; };
    
    setShader(s) { this.mShader = s; };
};