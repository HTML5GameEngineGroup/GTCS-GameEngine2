/*
 * File: texture_renderable.js
 *
 * Supports the drawing an entire file texture mapped onto an entire Renderable
 * 
 */
"use strict"

import Renderable from './renderable.js'
import * as texture from '../resources/texture.js'
import * as defaultResources from '../resources/default_resources.js'

  // Operate in Strict mode such that letiables must be declared before used!

class TextureRenderable extends Renderable {
    constructor(myTexture) {
        super();
        super.setColor([1, 1, 1, 0]); // Alpha of 0: switch off tinting of texture
        super._setShader(defaultResources.getTextureShader());
        
        this.mTexture = null;
        // these two instance variables are to cache texture information
        // for supporting per-pixel accurate collision
        this.mTextureInfo = null;
        this.mColorArray = null;
        // defined for subclass to override
        this.mElmWidthPixels = 0;
        this.mElmHeightPixels = 0;
        this.mElmLeftIndex = 0;
        this.mElmBottomIndex = 0;

        this.setTexture(myTexture);     // texture for this object, cannot be a "null"
    }

    draw(camera) {
        // activate the texture
        texture.activate(this.mTexture);
        super.draw(camera);
    }

    getTexture() { return this.mTexture; }
    setTexture(newTexture) {
        this.mTexture = newTexture;
        // these two instance variables are to cache texture information
        // for supporting per-pixel accurate collision
        this.mTextureInfo = texture.get(newTexture);
        this.mColorArray = null;
        // defined for one sprite element for subclass to override
        // For texture_renderable, one sprite element is the entire texture
        this.mElmWidthPixels = this.mTextureInfo.mWidth;
        this.mElmHeightPixels = this.mTextureInfo.mHeight;
        this.mElmLeftIndex = 0;
        this.mElmBottomIndex = 0;
    }

    // #region  Support per-pixel accurate collision
    // the following are support for per-pixel collision
    pixelTouches(other, wcTouchPos) {
        let pixelTouch = false;
        let xIndex = 0, yIndex;
        let otherIndex = [0, 0];
    
        let xDir = [1, 0];
        let yDir = [0, 1];
        let otherXDir = [1, 0];
        let otherYDir = [0, 1];
        vec2.rotate(xDir, xDir, this.mXform.getRotationInRad());
        vec2.rotate(yDir, yDir, this.mXform.getRotationInRad());
        vec2.rotate(otherXDir, otherXDir, other.mXform.getRotationInRad());
        vec2.rotate(otherYDir, otherYDir, other.mXform.getRotationInRad());
    
        while ((!pixelTouch) && (xIndex < this.mElmWidthPixels)) {
            yIndex = 0;
            while ((!pixelTouch) && (yIndex < this.mElmHeightPixels)) {
                if (this._pixelAlphaValue(xIndex, yIndex) > 0) {
                    this._indexToWCPosition(wcTouchPos, xIndex, yIndex, xDir, yDir);
                    other._wcPositionToIndex(otherIndex, wcTouchPos, otherXDir, otherYDir);
                    if ((otherIndex[0] >= 0) && (otherIndex[0] < other.mElmWidthPixels) &&
                        (otherIndex[1] >= 0) && (otherIndex[1] < other.mElmHeightPixels)) {
                        pixelTouch = other._pixelAlphaValue(otherIndex[0], otherIndex[1]) > 0;
                    }
                }
                yIndex++;
            }
            xIndex++;
        }
        return pixelTouch;
    }
    
    setColorArray() {
        if (this.mColorArray === null) {
            this.mColorArray = texture.getColorArray(this.mTexture);
        }
    }
    
    _pixelAlphaValue(x, y) {
        x = x * 4;
        y = y * 4;
        return this.mColorArray[(y * this.mTextureInfo.mWidth) + x  + 3];
    }
    
    _wcPositionToIndex(returnIndex, wcPos, xDir, yDir) {
        // use wcPos to compute the corresponding returnIndex[0 and 1]
        let delta = [];
        vec2.sub(delta, wcPos, this.mXform.getPosition());
        let xDisp = vec2.dot(delta, xDir);
        let yDisp = vec2.dot(delta, yDir);
        returnIndex[0] = this.mElmWidthPixels  * (xDisp / this.mXform.getWidth());
        returnIndex[1] = this.mElmHeightPixels * (yDisp / this.mXform.getHeight());
    
        // recall that xForm.getPosition() returns center, yet
        // Texture origin is at lower-left corner!
        returnIndex[0] += this.mElmWidthPixels / 2;
        returnIndex[1] += this.mElmHeightPixels / 2;
    
        returnIndex[0] = Math.floor(returnIndex[0]);
        returnIndex[1] = Math.floor(returnIndex[1]);
    }
    
    _indexToWCPosition(returnWCPos, i, j, xDir, yDir) {
        let x = i * this.mXform.getWidth() / this.mElmWidthPixels;
        let y = j * this.mXform.getHeight() / this.mElmHeightPixels;
        let xDisp = x - (this.mXform.getWidth() * 0.5);
        let yDisp = y - (this.mXform.getHeight() * 0.5);
        let xDirDisp = [];
        let yDirDisp = [];
    
        vec2.scale(xDirDisp, xDir, xDisp);
        vec2.scale(yDirDisp, yDir, yDisp);
        vec2.add(returnWCPos, this.mXform.getPosition(), xDirDisp);
        vec2.add(returnWCPos, returnWCPos, yDirDisp);
    }
    // #endregion
}

export default TextureRenderable;