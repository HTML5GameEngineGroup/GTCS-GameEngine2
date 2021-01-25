/* 
 * File: Camera.js
 * Encapsulates the user define WC and Viewport functionality
 */
"use strict";

import * as core from './Core/Engine_Core.js';

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
    constructor (wcCenter, wcWidth, viewportArray) {
        // WC and viewport position and size
        this.mWCCenter = wcCenter;
        this.mWCWidth = wcWidth;
        this.mViewport = viewportArray;  // [x, y, width, height]
        this.mNearPlane = 0;
        this.mFarPlane = 1000;

        // transformation matrices
        this.mViewMatrix = mat4.create();
        this.mProjMatrix = mat4.create();
        this.mVPMatrix = mat4.create();

        // background color
        this.mBgColor = [0.8, 0.8, 0.8, 1]; // RGB and Alpha
    };

    setWCCenter(xPos, yPos) {
        this.mWCCenter[0] = xPos;
        this.mWCCenter[1] = yPos;
    };
    getWCCenter() { return this.mWCCenter; };
    setWCWidth(width) { this.mWCWidth = width; };

    setViewport(viewportArray) { this.mViewport = viewportArray; };
    getViewport()  { return this.mViewport; };
    

    setBackgroundColor(newColor) { this.mBgColor = newColor; };
    getBackgroundColor()  { return this.mBgColor; };

    // Getter for the View-Projection transform operator
    getVPMatrix()  {
        return this.mVPMatrix;
    };
    

    // Initializes the camera to begin drawing
    setupViewProjection() {
        //<editor-fold desc="Step A: Set up and clear the Viewport">
        // Step A1: Set up the viewport: area on canvas to be drawn
        core.gGL.viewport(this.mViewport[0],  // x position of bottom-left corner of the area to be drawn
                    this.mViewport[1],  // y position of bottom-left corner of the area to be drawn
                    this.mViewport[2],  // width of the area to be drawn
                    this.mViewport[3]); // height of the area to be drawn
        // Step A2: set up the corresponding scissor area to limit the clear area
        core.gGL.scissor(this.mViewport[0], // x position of bottom-left corner of the area to be drawn
                   this.mViewport[1], // y position of bottom-left corner of the area to be drawn
                   this.mViewport[2], // width of the area to be drawn
                   this.mViewport[3]);// height of the area to be drawn
        // Step A3: set the color to be clear
        core.gGL.clearColor(this.mBgColor[0], this.mBgColor[1], this.mBgColor[2], this.mBgColor[3]);  // set the color to be cleared
        // Step A4: enable the scissor area, clear, and then disable the scissor area
        core.gGL.enable(core.gGL.SCISSOR_TEST);
        core.gGL.clear(core.gGL.COLOR_BUFFER_BIT);
        core.gGL.disable(core.gGL.SCISSOR_TEST);
        //</editor-fold>

        //<editor-fold desc="Step  B: Set up the View-Projection transform operator"> 
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
             this.mFarPlane  // z-distance to far plane 
        );

        // Step B3: concatenate view and project matrices
        mat4.multiply(this.mVPMatrix, this.mProjMatrix, this.mViewMatrix);
        //</editor-fold>
    };
};

export default Camera;