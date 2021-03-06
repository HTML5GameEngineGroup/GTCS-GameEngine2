"use strict";  // Operate in Strict mode such that variables must be declared before used!

import BoundingBox from '../bounding_box.js'

class GameObject {
    constructor() {
        this.mRenderComponent = null;
        this.mVisible = true;
        this.mCurrentFrontDir = vec2.fromValues(0, 1);  // this is the current front direction of the object
        this.mSpeed = 0;
    }

    getXform() { return this.mRenderComponent.getXform(); }
    getBBox() {
        var xform = this.getXform();
        var b = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
        return b;
    }
    setVisibility(f) { this.mVisible = f; }
    isVisible() { return this.mVisible; }

    setSpeed(s) { this.mSpeed = s; }
    getSpeed() { return this.mSpeed; }
    incSpeedBy(delta) { this.mSpeed += delta; }

    setCurrentFrontDir(f) { vec2.normalize(this.mCurrentFrontDir, f); }
    getCurrentFrontDir() { return this.mCurrentFrontDir; }

    getRenderable() { return this.mRenderComponent; }

    // Orientate the entire object to point towards point p
    // will rotate Xform() accordingly
    rotateObjPointTo(p, rate) {
        // Step A: determine if reach the destination position p
        var dir = [];
        vec2.sub(dir, p, this.getXform().getPosition());
        var len = vec2.length(dir);
        if (len < Number.MIN_VALUE) {
            return; // we are there.
        }
        vec2.scale(dir, dir, 1 / len);

        // Step B: compute the angle to rotate
        var fdir = this.getCurrentFrontDir();
        var cosTheta = vec2.dot(dir, fdir);

        if (cosTheta > 0.999999) { // almost exactly the same direction
            return;
        }

        // Step C: clamp the cosTheda to -1 to 1 
        // in a perfect world, this would never happen! BUT ...
        if (cosTheta > 1) {
            cosTheta = 1;
        } else {
            if (cosTheta < -1) {
                cosTheta = -1;
            }
        }

        // Step D: compute whether to rotate clockwise, or counterclockwise
        var dir3d = vec3.fromValues(dir[0], dir[1], 0);
        var f3d = vec3.fromValues(fdir[0], fdir[1], 0);
        var r3d = [];
        vec3.cross(r3d, f3d, dir3d);

        var rad = Math.acos(cosTheta);  // radian to roate
        if (r3d[2] < 0) {
            rad = -rad;
        }

        // Step E: rotate the facing direction with the angle and rate
        rad *= rate;  // actual angle need to rotate from Obj's front
        vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), rad);
        this.getXform().incRotationByRad(rad);
    }

    update() {
        // simple default behavior
        var pos = this.getXform().getPosition();
        vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
    }

    draw(aCamera) {
        if (this.isVisible()) {
            this.mRenderComponent.draw(aCamera);
        }
    }

    // Support for per-pixel collision
    pixelTouches(otherObj, wcTouchPos) {
        // only continue if both objects have getColorArray defined 
        // if defined, should have other texture intersection support!
        var pixelTouch = false;
        var myRen = this.getRenderable();
        var otherRen = otherObj.getRenderable();
    
        if ((typeof myRen.pixelTouches === "function") && (typeof otherRen.pixelTouches === "function")) {
            if ((myRen.getXform().getRotationInRad() === 0) && (otherRen.getXform().getRotationInRad() === 0)) {
                // no rotation, we can use bbox ...
                var otherBbox = otherObj.getBBox();
                if (otherBbox.intersectsBound(this.getBBox())) {
                    myRen.setColorArray();
                    otherRen.setColorArray();
                    pixelTouch = myRen.pixelTouches(otherRen, wcTouchPos);
                }
            } else {
                // One or both are rotated, compute an encompassing circle
                // by using the hypotenuse as radius
                var mySize = myRen.getXform().getSize();
                var otherSize = otherRen.getXform().getSize();
                var myR = Math.sqrt(0.5*mySize[0]*0.5*mySize[0] + 0.5*mySize[1]*0.5*mySize[1]);
                var otherR = Math.sqrt(0.5*otherSize[0]*0.5*otherSize[0] + 0.5*otherSize[1]*0.5*otherSize[1]);
                var d = [];
                vec2.sub(d, myRen.getXform().getPosition(), otherRen.getXform().getPosition());
                if (vec2.length(d) < (myR + otherR)) {
                    myRen.setColorArray();
                    otherRen.setColorArray();
                    pixelTouch = myRen.pixelTouches(otherRen, wcTouchPos);
                }
            }
        }
        return pixelTouch;
    }
}

export default GameObject;