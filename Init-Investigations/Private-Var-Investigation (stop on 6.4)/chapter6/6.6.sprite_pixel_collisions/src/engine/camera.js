/*
 * File: camera.js
 *
 * Encapsulates the user define WC and Viewport functionality
 */
"use strict";

import * as glSys from "./core/gl.js";
import BoundingBox from "./bounding_box.js";

class Camera {
    // wcCenter: is a vec2
    // wcWidth: is the width of the user defined WC
    //      Height of the user defined WC is implicitly defined by the viewport aspect ratio
    //      Please refer to the following
    // viewportRect: an array of 4 elements
    //      [0] [1]: (x,y) position of lower left corner on the canvas (in pixel)
    //      [2]: width of viewport
    //      [3]: height of viewport
    //      
    //  wcHeight = wcWidth * viewport[3]/viewport[2]
    //
    constructor(wcCenter, wcWidth, viewportArray) {
        // WC and viewport position and size
        this.mWCCenter = wcCenter;
        this.mWCWidth = wcWidth;
        this.mViewport = viewportArray;  // [x, y, width, height]

        // Camera transform operator
        this.mCameraMatrix = mat4.create();

        // background color
        this.mBGColor = [0.8, 0.8, 0.8, 1]; // RGB and Alpha
    }

    setWCCenter(xPos, yPos) {
        this.mWCCenter[0] = xPos;
        this.mWCCenter[1] = yPos;
    }
    getWCCenter() { return this.mWCCenter; }
    setWCWidth(width) { this.mWCWidth = width; }

    setViewport(viewportArray) { this.mViewport = viewportArray; }
    getViewport() { return this.mViewport; }
    getWCWidth() { return this.mWCWidth; }
    getWCHeight() { return this.mWCWidth * this.mViewport[3] / this.mViewport[2]; }                                              // viewportH/viewportW

    setBackgroundColor(newColor) { this.mBGColor = newColor; }
    getBackgroundColor() { return this.mBGColor; }

    
    // call before you start drawing with this camera
    setViewAndCameraMatrix() {
        let gl = glSys.get();
        // Step A1: Set up the viewport: area on canvas to be drawn
        gl.viewport(this.mViewport[0],  // x position of bottom-left corner of the area to be drawn
            this.mViewport[1],  // y position of bottom-left corner of the area to be drawn
            this.mViewport[2],  // width of the area to be drawn
            this.mViewport[3]); // height of the area to be drawn
        // Step A2: set up the corresponding scissor area to limit the clear area
        gl.scissor(this.mViewport[0], // x position of bottom-left corner of the area to be drawn
            this.mViewport[1], // y position of bottom-left corner of the area to be drawn
            this.mViewport[2], // width of the area to be drawn
            this.mViewport[3]);// height of the area to be drawn
        
            // Step A3: set the color to be clear
        gl.clearColor(this.mBGColor[0], this.mBGColor[1], this.mBGColor[2], this.mBGColor[3]);  // set the color to be cleared
        // Step A4: enable the scissor area, clear, and then disable the scissor area
        gl.enable(gl.SCISSOR_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.disable(gl.SCISSOR_TEST);

        // Step B: Compute the Camera Matrix

        // Step B1: compute wcHeight
        let wcHeight = this.mWCWidth * this.mViewport[3] / this.mViewport[2]; // viewportH/viewportW
        
        // Step B2: following the translation, scale to: (-1, -1) to (1, 1): a 2x2 square at origin
        mat4.scale(this.mCameraMatrix, mat4.create(), vec3.fromValues(2.0/this.mWCWidth, 2.0/wcHeight, 1.0));

        // Step B3: first operation to perform is to translate camera center to the origin
        mat4.translate(this.mCameraMatrix, this.mCameraMatrix, vec3.fromValues(-this.mWCCenter[0], -this.mWCCenter[1], 0));
    }

    // Getter for the View-Projection transform operator
    getCameraMatrix() {
        return this.mCameraMatrix;
    }

    collideWCBound(aXform, zone) {
        let bbox = new BoundingBox(aXform.getPosition(), aXform.getWidth(), aXform.getHeight());
        let w = zone * this.getWCWidth();
        let h = zone * this.getWCHeight();
        let cameraBound = new BoundingBox(this.getWCCenter(), w, h);
        return cameraBound.boundCollideStatus(bbox);
    }

}

export default Camera;