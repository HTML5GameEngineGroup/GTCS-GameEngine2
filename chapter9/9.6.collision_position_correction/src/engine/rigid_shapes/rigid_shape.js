
/* 
 * File: rigid_shape.js
 *      base class for objects to participate in physics system
 */
"use strict";

import * as physics from "../physics.js";
import * as loop from "../core/loop.js";
import * as input from "../input.js";
import LineRenderable from "../renderables/line_renderable.js";

let kRigidShapeUIDelta = 0.01;   // for UI interactive debugging
let kDrawNumCircleSides = 16;    // for approx circumference as line segements
let kPrintPrecision = 2;         // for printing float precision

class RigidShape {
    constructor(xf) {
        this.mLine = new LineRenderable();
        this.mLine.setColor([1, 1, 1, 1]);

        this.mXform = xf;
        this.mAcceleration = physics.getSystemAcceleration();
        this.mVelocity = vec2.fromValues(0, 0);
        this.mType = "";

        this.mInvMass = 1;
        this.mAngularVelocity = 0;

        this.mBoundRadius = 0;

        this.mDrawBounds = false;
    }

    // #region getters and setters
    getType() { return this.mType; }

    getInvMass() { return this.mInvMass; }
    setMass(m) {
        if (m > 0) {
            this.mInvMass = 1 / m;
            this.mAcceleration = physics.getSystemAcceleration()
        } else {
            this.mInvMass = 0;
            this.mAcceleration = [0, 0];  // to ensure object does not move
        }
    }

    getAngularVelocity() { return this.mAngularVelocity; }
    setAngularVelocity(w) { this.mAngularVelocity = w; }
    setAngularVelocityDelta(dw) { this.mAngularVelocity += dw; }

    getCenter() { return this.mXform.getPosition(); }
    getBoundRadius() { return this.mBoundRadius; }

    toggleDrawBound() { this.mDrawBounds = !this.mDrawBounds; }
    setBoundRadius(r) { this.mBoundRadius = r; }

    getVelocity() { return this.mVelocity; }
    setVelocity(x, y) {
        this.mVelocity[0] = x;
        this.mVelocity[1] = y;
    }
    flipVelocity() {
        this.mVelocity[0] = -this.mVelocity[0];
        this.mVelocity[1] = -this.mVelocity[1];
    }

    setTransform(xf) { this.mXform = xf; }
    // #endregion

    travel() {
        let dt = loop.getUpdateIntervalInSeconds();

        // update acceleration
        vec2.scaleAndAdd(this.mVelocity, this.mVelocity, this.mAcceleration, dt);

        //s += v*t  with new velocity
        // linear motion
        let p = this.mXform.getPosition();
        vec2.scaleAndAdd(p, p, this.mVelocity, dt);

        this.mXform.incRotationByRad(this.mAngularVelocity * dt);
    }

    adjustPositionBy(v, delta) {
        let p = this.mXform.getPosition();
        vec2.scaleAndAdd(p, p, v, delta);
    }

    update() {

        if (this.mInvMass === 0)
            return;

        if (physics.getHasMotion())
            this.travel();
    }

    boundTest(otherShape) {
        let vFrom1to2 = [0, 0];
        vec2.subtract(vFrom1to2, otherShape.mXform.getPosition(), this.mXform.getPosition());
        let rSum = this.mBoundRadius + otherShape.mBoundRadius;
        let dist = vec2.length(vFrom1to2);
        if (dist > rSum) {
            //not overlapping
            return false;
        }
        return true;
    }

    // #region drawing as line and circle
    draw(aCamera) {
        if (!this.mDrawBounds)
            return;

        let len = this.mBoundRadius * 0.5;
        //calculation for the X at the center of the shape
        let x = this.mXform.getXPos();
        let y = this.mXform.getYPos();

        this.mLine.setColor([1, 1, 1, 1]);
        this.mLine.setFirstVertex(x - len, y);  //Horizontal
        this.mLine.setSecondVertex(x + len, y); //
        this.mLine.draw(aCamera);

        this.mLine.setFirstVertex(x, y + len);  //Vertical
        this.mLine.setSecondVertex(x, y - len); //
        this.mLine.draw(aCamera);
    }

    drawCircle(aCamera, r) {
        let pos = this.mXform.getPosition();
        let prevPoint = vec2.clone(pos);
        let deltaTheta = (Math.PI * 2.0) / kDrawNumCircleSides;
        let theta = deltaTheta;
        prevPoint[0] += r;
        let i, x, y;
        for (i = 1; i <= kDrawNumCircleSides; i++) {
            x = pos[0] + r * Math.cos(theta);
            y = pos[1] + r * Math.sin(theta);

            this.mLine.setFirstVertex(prevPoint[0], prevPoint[1]);
            this.mLine.setSecondVertex(x, y);
            this.mLine.draw(aCamera);

            theta = theta + deltaTheta;
            prevPoint[0] = x;
            prevPoint[1] = y;
        }
    }
    // #endregion 

    // #region support interactive debugging and state querying
    getCurrentState() {
        let m = this.mInvMass;
        if (m !== 0)
            m = 1 / m;

        return "M=" + m.toFixed(kPrintPrecision);
    }

    userSetsState() {
        // keyboard control
        let delta = 0;

        if (input.isKeyPressed(input.keys.Up)) {
            delta = kRigidShapeUIDelta;
        }
        if (input.isKeyPressed(input.keys.Down)) {
            delta = -kRigidShapeUIDelta;
        }
        if (delta !== 0) {
            if (input.isKeyPressed(input.keys.M)) {
                let m = 0;
                if (this.mInvMass > 0)
                    m = 1 / this.mInvMass;
                this.setMass(m + delta * 10);
            }
        }
    }
    // #endregion
}

export default RigidShape;