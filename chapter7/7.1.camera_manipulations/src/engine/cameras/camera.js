/*
 * File: camera.js
 *
 * Encapsulates the user define WC and Viewport functionality
 */
"use strict"

import * as glSys from "../core/gl.js";
import BoundingBox from "../bounding_box.js";
import { eBoundCollideStatus } from "../bounding_box.js";

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
        this.mWCCenter = wcCenter;
        this.mWCWidth = wcWidth;
        this.mViewport = viewportArray;  // [x, y, width, height]
        
        // transformation matrices
        this.mCameraMatrix = mat4.create();

        // background color
        this.mBGColor = [0.8, 0.8, 0.8, 1]; // RGB and Alpha
    }

    // #region Basic getter and setters
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
    // #endregion

    // #region Compute and access camera transform matrix

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
        let center = this.getWCCenter();

        // Step B2: following the translation, scale to: (-1, -1) to (1, 1): a 2x2 square at origin
        mat4.scale(this.mCameraMatrix, mat4.create(), vec3.fromValues(2.0 / this.getWCWidth(), 2.0 / this.getWCHeight(), 1.0));

        // Step B3: first operation to perform is to translate camera center to the origin
        mat4.translate(this.mCameraMatrix, this.mCameraMatrix, vec3.fromValues(-center[0], -center[1], 0));
    }

    // Getter for the View-Projection transform operator
    getCameraMatrix() {
        return this.mCameraMatrix;
    }
    // #endregion

    // #region utilities WC bounds: collide and clamp
    // utilities
    collideWCBound(aXform, zone) {
        let bbox = new BoundingBox(aXform.getPosition(), aXform.getWidth(), aXform.getHeight());
        let w = zone * this.getWCWidth();
        let h = zone * this.getWCHeight();
        let cameraBound = new BoundingBox(this.getWCCenter(), w, h);
        return cameraBound.boundCollideStatus(bbox);
    }

    // prevents the xform from moving outside of the WC boundary.
    // by clamping the aXfrom at the boundary of WC, 
    clampAtBoundary(aXform, zone) {
        let status = this.collideWCBound(aXform, zone);
        if (status !== eBoundCollideStatus.eInside) {
            let pos = aXform.getPosition();
            if ((status & eBoundCollideStatus.eCollideTop) !== 0) {
                pos[1] = (this.getWCCenter())[1] + (zone * this.getWCHeight() / 2) - (aXform.getHeight() / 2);
            }
            if ((status & eBoundCollideStatus.eCollideBottom) !== 0) {
                pos[1] = (this.getWCCenter())[1] - (zone * this.getWCHeight() / 2) + (aXform.getHeight() / 2);
            }
            if ((status & eBoundCollideStatus.eCollideRight) !== 0) {
                pos[0] = (this.getWCCenter())[0] + (zone * this.getWCWidth() / 2) - (aXform.getWidth() / 2);
            }
            if ((status & eBoundCollideStatus.eCollideLeft) !== 0) {
                pos[0] = (this.getWCCenter())[0] - (zone * this.getWCWidth() / 2) + (aXform.getWidth() / 2);
            }
        }
        return status;
    }

    // pan the camera to ensure aXform is within camera bounds
    // this is complementary to the ClampAtBound: instead of clamping aXform, now, move the camera
    panWith(aXform, zone) {
        let status = this.collideWCBound(aXform, zone);
        if (status !== eBoundCollideStatus.eInside) {
            let pos = aXform.getPosition();
            let newC = this.getWCCenter();
            if ((status & eBoundCollideStatus.eCollideTop) !== 0) {
                newC[1] = pos[1] + (aXform.getHeight() / 2) - (zone * this.getWCHeight() / 2);
            }
            if ((status & eBoundCollideStatus.eCollideBottom) !== 0) {
                newC[1] = pos[1] - (aXform.getHeight() / 2) + (zone * this.getWCHeight() / 2);
            }
            if ((status & eBoundCollideStatus.eCollideRight) !== 0) {
                newC[0] = pos[0] + (aXform.getWidth() / 2) - (zone * this.getWCWidth() / 2);
            }
            if ((status & eBoundCollideStatus.eCollideLeft) !== 0) {
                newC[0] = pos[0] - (aXform.getWidth() / 2) + (zone * this.getWCWidth() / 2);
            }
        }
    }
    //#endregion

    // #region Camera Manipulation support
    panBy(dx, dy) {
        this.mWCCenter[0] += dx;
        this.mWCCenter[1] += dy;
    }


    panTo(cx, cy) {
        this.setWCCenter(cx, cy);
    }

    // zoom with respect to the center
    // zoom > 1 ==> zooming out, see more of the world
    // zoom < 1 ==> zooming in, see less of the world, more detailed
    // zoom < 0 is ignored
    zoomBy(zoom) {
        if (zoom > 0) {
            this.setWCWidth(this.getWCWidth() * zoom);
        }
    }

    // zoom towards (pX, pY) by zoom: 
    // zoom > 1 ==> zooming out, see more of the world
    // zoom < 1 ==> zooming in, see less of the world, more detailed
    // zoom < 0 is ignored
    zoomTowards(pos, zoom) {
        let delta = [];
        vec2.sub(delta, pos, this.mWCCenter);
        vec2.scale(delta, delta, zoom - 1);
        vec2.sub(this.mWCCenter, this.mWCCenter, delta);
        this.zoomBy(zoom);
    }
    //#endregion 
}

export default Camera;