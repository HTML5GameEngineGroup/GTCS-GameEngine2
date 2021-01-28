/*
 * File: SpriteRenderable.js
 *  
 * Texture objects where texture coordinate can change
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as defaultResources from './Core/Resources/Engine_DefaultResources.js'
import * as map from './Core/Resources/Engine_ResourceMap.js'

import TextureRenderable from './TextureRenderable.js'

//// the expected texture coordinate array is an array of 8 floats where elements:
    //  [0] [1]: is u/v coordinate of Right-Top
    //  [2] [3]: is u/v coordinate of Left-Top
    //  [4] [5]: is u/v coordinate of Right-Bottom
    //  [6] [7]: is u/v coordinate of Left-Bottom
    // Convention: eName is an enumerated data type
eTexCoordArray = Object.freeze({
    eLeft: 2,
    eRight: 0,
    eTop: 1,
    eBottom: 5
});

class SpriteRenderable extends TextureRenderable {
    constructor(myTexture) {
        super(myTexture);
        setShader(defaultResources.mSpriteShader);
        this.mTexLeft = 0.0;   // bounds of texture coordinate (0 is left, 1 is right)
        this.mTexRight = 1.0;  // 
        this.mTexTop = 1.0;    //   1 is top and 0 is bottom of image
        this.mTexBottom = 0.0; // 
    }


    // input parameters are the u/v coordinate values
    setElementUVCoordinate(left, right, bottom, top) {
        this.mTexLeft = left;
        this.mTexRight = right;
        this.mTexBottom = bottom;
        this.mTexTop = top;
    };

    // specify element region by pixel positions (between 0 to image resolutions)
    setElementPixelPositions(left, right, bottom, top) {
        var texInfo = map.retrieveAsset(this.mTexture);
        // entire image width, height
        var imageW = texInfo.mWidth;
        var imageH = texInfo.mHeight;

        this.mTexLeft = left / imageW;
        this.mTexRight = right / imageW;
        this.mTexBottom = bottom / imageH;
        this.mTexTop = top / imageH;
    };

    getElementUVCoordinateArray() {
        return [
            this.mTexRight,  this.mTexTop,          // x,y of top-right
            this.mTexLeft,   this.mTexTop,
            this.mTexRight,  this.mTexBottom,
            this.mTexLeft,   this.mTexBottom
        ];
    };

    draw(vpMatrix) {
        // set the current texture coordinate
        // 
        // activate the texture
        this.mShader.setTextureCoordinate(this.getElementUVCoordinateArray());
        super.draw(vpMatrix);
    };
}

export default SpriteRenderable;