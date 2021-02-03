"use strict"

/* 
 * Encapsulates the user define WC and Viewport functionality
 */

import * as gl from './internal/gl.js'

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
        this.mNearPlane = 0;
        this.farPlane = 1000;

        // transformation matrices
        this.mViewMatrix = mat4.create();
        this.mProjMatrix = mat4.create();
        this.mCameraMatrix = mat4.create();

        // background color
        this.mBGColor = [0.8, 0.8, 0.8, 1]; // RGB and Alpha
    };

    setWCCenter(xPos, yPos) {
        this.mWCCenter[0] = xPos;
        this.mWCCenter[1] = yPos;
    };
    getWCCenter() { return this.mWCCenter; };
    setWCWidth(width) { this.mWCWidth = width; };

    setViewport(viewportArray) { this.mViewport = viewportArray; };
    getViewport() { return this.mViewport; };


    setBackgroundColor(newColor) { this.mBGColor = newColor; };
    getBackgroundColor() { return this.mBGColor; };

    

    // call before you start drawing with this camera
    setCameraMatrix() {
        // Step A1: Set up the viewport: area on canvas to be drawn
        gl.get().viewport(this.mViewport[0],  // x position of bottom-left corner of the area to be drawn
            this.mViewport[1],  // y position of bottom-left corner of the area to be drawn
            this.mViewport[2],  // width of the area to be drawn
            this.mViewport[3]); // height of the area to be drawn
        // Step A2: set up the corresponding scissor area to limit the clear area
        gl.get().scissor(this.mViewport[0], // x position of bottom-left corner of the area to be drawn
            this.mViewport[1], // y position of bottom-left corner of the area to be drawn
            this.mViewport[2], // width of the area to be drawn
            this.mViewport[3]);// height of the area to be drawn

        // Step B1: define the view matrix
        mat4.lookAt(this.mViewMatrix,
            [this.mWCCenter[0], this.mWCCenter[1], 10],   // WC center
            [this.mWCCenter[0], this.mWCCenter[1], 0],    // 
            [0, 1, 0]);     // orientation

        // Step B2: define the projection matrix
        var halfWCWidth = 0.5 * this.mWCWidth;
        var halfWCHeight = halfWCWidth * this.mViewport[3] / this.mViewport[2]; // viewportH/viewportW
        mat4.ortho(this.mProjMatrix,
            -halfWCWidth,   // distance to left of WC
            halfWCWidth,   // distance to right of WC
            -halfWCHeight,  // distance to bottom of WC
            halfWCHeight,  // distance to top of WC
            this.mNearPlane,   // z-distance to near plane 
            this.farPlane  // z-distance to far plane 
        );
        // Step B3: concatenate view and project matrices
        mat4.multiply(this.mCameraMatrix, this.mProjMatrix, this.mViewMatrix);
    
        // Step A3: set the color to be clear
        gl.get().clearColor(this.mBGColor[0], this.mBGColor[1], this.mBGColor[2], this.mBGColor[3]);  // set the color to be cleared
        // Step A4: enable the scissor area, clear, and then disable the scissor area
        gl.get().enable(gl.get().SCISSOR_TEST);
        gl.get().clear(gl.get().COLOR_BUFFER_BIT);
        gl.get().disable(gl.get().SCISSOR_TEST);
    }
    // Getter for the View-Projection transform operator
    getCameraMatrix() {
        return this.mCameraMatrix;
    };

};

export default Camera;