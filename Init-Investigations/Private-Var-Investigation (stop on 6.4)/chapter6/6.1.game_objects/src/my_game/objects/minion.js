"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Minion extends engine.GameObject {
    constructor(spriteTexture, atY) {
        super(null);
        this.kDelta = 0.2;
        this._mRenderComponent = new engine.SpriteAnimateRenderable(spriteTexture);
        this._mRenderComponent.setColor([1, 1, 1, 0]);
        this._mRenderComponent.getXform().setPosition(Math.random() * 100, atY);
        this._mRenderComponent.getXform().setSize(12, 9.6);
        this._mRenderComponent.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,   // width x height in pixels
            5,          // number of elements in this sequence
            0);         // horizontal padding in between
        this._mRenderComponent.setAnimationType(engine.eAnimationType.eSwing);
        this._mRenderComponent.setAnimationSpeed(15);
        // show each element for mAnimSpeed updates
    }

    update() {
        // remember to update this._mRenderComponent's animation
        this._mRenderComponent.updateAnimation();

        // move towards the left and wraps
        let xform = this.getXform();
        xform.incXPosBy(-this.kDelta);

        // if fly off to the left, re-appear at the right
        if (xform.getXPos() < 0) {
            xform.setXPos(100);
            xform.setYPos(65 * Math.random());
        }
    }
}

export default Minion;