/*
 * File: game_object.js
 *
 * defines the behavior and appearance of a game object
 * 
 */
"use strict";

class GameObject {   
    constructor(renderable) {
        this._mRenderComponent = renderable;
    }

    getXform() { return this._mRenderComponent.getXform(); }
    
    getRenderable() { return this._mRenderComponent; }s

    update() {  }   

    draw(aCamera) {
        this._mRenderComponent.draw(aCamera);
    }
}

export default GameObject;