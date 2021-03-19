/*
 * File: camera.js
 *
 * Encapsulates the user define WC and Viewport functionality
 */
"use strict"

import * as GLSys from "../core/internal/gl.js";
import * as input from "../core/input.js";
import CameraShake from "./camera_shake.js";
import CameraState from "./camera_state.js";
import BoundingBox from "../utils/bounding_box.js";
import { eBoundCollideStatus } from "../utils/bounding_box.js";

const eViewport = Object.freeze({
    eOrgX: 0,
    eOrgY: 1,
    eWidth: 2,
    eHeight: 3
});

class PerRenderCache {
    // Information to be updated once per render for efficiency concerns
    constructor() {
        this.mWCToPixelRatio = 1;  // WC to pixel transformation
        this.mCameraOrgX = 1; // Lower-left corner of camera in WC 
        this.mCameraOrgY = 1;
        this.mCameraPosInPixelSpace = vec3.fromValues(0, 0, 0); //
    }
}

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
    constructor(wcCenter, wcWidth, viewportArray, bound) {
        this.mCameraState = new CameraState(wcCenter, wcWidth);
        this.mCameraShake = null;

        this.mViewport = [];  // [x, y, width, height]
        this.mViewportBound = 0;
        if (bound !== undefined) {
            this.mViewportBound = bound;
        }
        this.mScissorBound = [];  // use for bounds
        this.setViewport(viewportArray, this.mViewportBound);

        this.kCameraZ = 10; // this is for illuminaiton computaiton

        // transformation matrices
        this.mCameraMatrix = mat4.create();

        // background color
        this.mBGColor = [0.8, 0.8, 0.8, 1]; // RGB and Alpha

        // per-rendering cached information
        // needed for computing transforms for shaders
        // updated each time in SetupViewProjection()
        this.mRenderCache = new PerRenderCache();
            // SHOULD NOT be used except 
            // xform operations during the rendering
            // Client game should not access this!
    }

    // #region Basic getter and setters
    setWCCenter(xPos, yPos) {
        let p = vec2.fromValues(xPos, yPos);
        this.mCameraState.setCenter(p);
    }
    getWCCenter() { return this.mCameraState.getCenter(); }
    getWCCenterInPixelSpace() { return this.mRenderCache.mCameraPosInPixelSpace; };
    setWCWidth(width) { this.mCameraState.setWidth(width); }
    getWCWidth() { return this.mCameraState.getWidth(); }
    getWCHeight() {
        // viewportH/viewportW
        let ratio = this.mViewport[eViewport.eHeight] / this.mViewport[eViewport.eWidth];
        return this.mCameraState.getWidth() * ratio;
    }

    setViewport(viewportArray, bound) {
        if (bound === undefined) {
            bound = this.mViewportBound;
        }
        // [x, y, width, height]
        this.mViewport[0] = viewportArray[0] + bound;
        this.mViewport[1] = viewportArray[1] + bound;
        this.mViewport[2] = viewportArray[2] - (2 * bound);
        this.mViewport[3] = viewportArray[3] - (2 * bound);
        this.mScissorBound[0] = viewportArray[0];
        this.mScissorBound[1] = viewportArray[1];
        this.mScissorBound[2] = viewportArray[2];
        this.mScissorBound[3] = viewportArray[3];
    }

    getViewport() {
        let out = [];
        out[0] = this.mScissorBound[0];
        out[1] = this.mScissorBound[1];
        out[2] = this.mScissorBound[2];
        out[3] = this.mScissorBound[3];
        return out;
    }

    setBackgroundColor(newColor) { this.mBGColor = newColor; }
    getBackgroundColor() { return this.mBGColor; }
    // #endregion

    // #region Compute and access camera transform matrix

    // call before you start drawing with this camera
    setViewAndCameraMatrix() {
        let gl = GLSys.get();
        // Step A1: Set up the viewport: area on canvas to be drawn
        gl.viewport(this.mViewport[0],  // x position of bottom-left corner of the area to be drawn
            this.mViewport[1],  // y position of bottom-left corner of the area to be drawn
            this.mViewport[2],  // width of the area to be drawn
            this.mViewport[3]); // height of the area to be drawn
        // Step A2: set up the corresponding scissor area to limit the clear area
        gl.scissor(this.mScissorBound[0], // x position of bottom-left corner of the area to be drawn
            this.mScissorBound[1], // y position of bottom-left corner of the area to be drawn
            this.mScissorBound[2], // width of the area to be drawn
            this.mScissorBound[3]);// height of the area to be drawn

        // Step A3: set the color to be clear
        gl.clearColor(this.mBGColor[0], this.mBGColor[1], this.mBGColor[2], this.mBGColor[3]);  // set the color to be cleared
        // Step A4: enable the scissor area, clear, and then disable the scissor area
        gl.enable(gl.SCISSOR_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.disable(gl.SCISSOR_TEST);

        // Step B: Compute the Camera Matrix
        let center = [];
        if (this.mCameraShake !== null) {
            center = this.mCameraShake.getCenter();
        } else {
            center = this.getWCCenter();
        }

        // Step B2: following the translation, scale to: (-1, -1) to (1, 1): a 2x2 square at origin
        mat4.scale(this.mCameraMatrix, mat4.create(), vec3.fromValues(2.0 / this.getWCWidth(), 2.0 / this.getWCHeight(), 1.0));

        // Step B3: first operation to perform is to translate camera center to the origin
        mat4.translate(this.mCameraMatrix, this.mCameraMatrix, vec3.fromValues(-center[0], -center[1], 0));
        
        // Step B4: compute and cache per-rendering information
        this.mRenderCache.mWCToPixelRatio = this.mViewport[eViewport.eWidth] / this.getWCWidth();
        this.mRenderCache.mCameraOrgX = center[0] - (this.getWCWidth() / 2);
        this.mRenderCache.mCameraOrgY = center[1] - (this.getWCHeight() / 2);
        let p = this.wcPosToPixel(this.getWCCenter());
        this.mRenderCache.mCameraPosInPixelSpace[0] = p[0];
        this.mRenderCache.mCameraPosInPixelSpace[1] = p[1];
        this.mRenderCache.mCameraPosInPixelSpace[2] = this.fakeZInPixelSpace(this.kCameraZ);
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
            let newC = vec2.clone(this.getWCCenter());
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
            this.mCameraState.setCenter(newC);
        }
    }
    //#endregion

    // #region Camera Manipulation support
    panBy(dx, dy) {
        let newC = vec2.clone(this.getWCCenter());
        newC[0] += dx;
        newC[1] += dy;
        this.mCameraState.setCenter(newC);
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
        let newC = [];
        vec2.sub(delta, pos, this.getWCCenter());
        vec2.scale(delta, delta, zoom - 1);
        vec2.sub(newC, this.getWCCenter(), delta);
        this.zoomBy(zoom);
        this.mCameraState.setCenter(newC);
    }
    //#endregion 

    // #region Mouse support   
    mouseDCX() {
        return input.getMousePosX() - this.mViewport[eViewport.eOrgX];
    }
    mouseDCY() {
        return input.getMousePosY() - this.mViewport[eViewport.eOrgY];
    }

    isMouseInViewport() {
        let dcX = this.mouseDCX();
        let dcY = this.mouseDCY();
        return ((dcX >= 0) && (dcX < this.mViewport[eViewport.eWidth]) &&
            (dcY >= 0) && (dcY < this.mViewport[eViewport.eHeight]));
    }

    mouseWCX() {
        let minWCX = this.getWCCenter()[0] - this.getWCWidth() / 2;
        return minWCX + (this.mouseDCX() * (this.getWCWidth() / this.mViewport[eViewport.eWidth]));
    }

    mouseWCY() {
        let minWCY = this.getWCCenter()[1] - this.getWCHeight() / 2;
        return minWCY + (this.mouseDCY() * (this.getWCHeight() / this.mViewport[eViewport.eHeight]));
    }
    // #endregion

    // #region update, LERP and Shake control
    update() {
        if (this.mCameraShake !== null) {
            if (this.mCameraShake.done()) {
                this.mCameraShake = null;
            } else {
                this.mCameraShake.setRefCenter(this.getWCCenter());
                this.mCameraShake.update();
            }
        }
        this.mCameraState.update();
    }

    configLerp(stiffness, duration) {
        this.mCameraState.config(stiffness, duration);
    }

    shake(deltas, freqs, duration) {
        this.mCameraShake = new CameraShake(this.mCameraState, deltas, freqs, duration);
    }

    reShake() {
        let success = (this.mCameraShake !== null);
        if (success)
            this.mCameraShake.reShake();
        return success;
    }
    // #endregion

    // #region support for wc to pixel space transform
    fakeZInPixelSpace(z) {
        return z * this.mRenderCache.mWCToPixelRatio;
    }

    wcPosToPixel(p) {  // p is a vec3, fake Z
        // Convert the position to pixel space
        let x = this.mViewport[Camera.eViewport.eOrgX] + ((p[0] - this.mRenderCache.mCameraOrgX) * this.mRenderCache.mWCToPixelRatio) + 0.5;
        let y = this.mViewport[Camera.eViewport.eOrgY] + ((p[1] - this.mRenderCache.mCameraOrgY) * this.mRenderCache.mWCToPixelRatio) + 0.5;
        let z = this.fakeZInPixelSpace(p[2]);
        return vec3.fromValues(x, y, z);
    }

    wcDirToPixel(d) {  // d is a vec3 direction in WC
        // Convert the position to pixel space
        let x = d[0] * this.mRenderCache.mWCToPixelRatio;
        let y = d[1] * this.mRenderCache.mWCToPixelRatio;
        let z = d[2];
        return vec3.fromValues(x, y, z);
    }

    wcSizeToPixel(s) {  // 
        return (s * this.mRenderCache.mWCToPixelRatio) + 0.5;
    }
    // #endregion
}

export default Camera;