"use strict"; // Operate in Strict mode such that variables must be declared before used!

import TextureRenderable from "./texture_renderable.js"
import * as defaultResources from "../resources/default_resources.js"
import * as texture from "../resources/texture.js"

  
//// the expected texture coordinate array is an array of 8 floats where elements:
//  [0] [1]: is u/v coordinate of Top-Right 
//  [2] [3]: is u/v coordinate of Top-Left
//  [4] [5]: is u/v coordinate of Bottom-Right
//  [6] [7]: is u/v coordinate of Bottom-Left
// Convention: eName is an enumerated data type
let eTexCoordArrayIndex = Object.freeze({
    eLeft: 2,
    eRight: 0,
    eTop: 1,
    eBottom: 5
});
    
class SpriteRenderable extends TextureRenderable {
    constructor(myTexture) {
        super(myTexture);
        super._setShader(defaultResources.getSpriteShader());
        // sprite coordinate
        this.mTexLeft = 0.0;   // bounds of texture coordinate (0 is left, 1 is right)
        this.mTexRight = 1.0;  // 
        this.mTexTop = 1.0;    //   1 is top and 0 is bottom of image
        this.mTexBottom = 0.0; // 
    }

    // specify element region by texture coordinate (between 0 to 1)
    setElementUVCoordinate(left, right, bottom, top) {
        this.mTexLeft = left;
        this.mTexRight = right;
        this.mTexBottom = bottom;
        this.mTexTop = top;
    }

    // specify element region by pixel positions (between 0 to image resolutions)
    setElementPixelPositions(left, right, bottom, top) {
        let texInfo = texture.get(this.mTexture);
        // entire image width, height
        let imageW = texInfo.mWidth;
        let imageH = texInfo.mHeight;

        this.mTexLeft = left / imageW;
        this.mTexRight = right / imageW;
        this.mTexBottom = bottom / imageH;
        this.mTexTop = top / imageH;
    }

    getElementUVCoordinateArray() {
        return [
            this.mTexRight,  this.mTexTop,          // x,y of top-right
            this.mTexLeft,   this.mTexTop,
            this.mTexRight,  this.mTexBottom,
            this.mTexLeft,   this.mTexBottom
        ];
    }

    draw(camera) {
        // set the current texture coordinate
        // 
        // activate the texture
        this.mShader.setTextureCoordinate(this.getElementUVCoordinateArray());
        super.draw(camera);
    }
}

export default SpriteRenderable;
export {eTexCoordArrayIndex}
