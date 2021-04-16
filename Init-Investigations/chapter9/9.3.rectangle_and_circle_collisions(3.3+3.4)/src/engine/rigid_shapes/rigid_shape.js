
/* 
 * File: rigid_shape.js
 *      base class for objects to participate in physics system
 */
"use strict";

import LineRenderable from "../renderables/line_renderable.js";

let kDrawNumCircleSides = 16;    // for approx circumference as line segements

class RigidShape {
    constructor(xf) {
        this.mLine = new LineRenderable();
        this.mLine.setColor([1, 1, 1, 1]);

        this.mXform = xf;
        this.mType = "";

        this.mBoundRadius = 0;
        this.mDrawBounds = false;
    }

    // #region getters and setters
    getType() { return this.mType; }

    getCenter() { return this.mXform.getPosition(); }
    getBoundRadius() { return this.mBoundRadius; }

    toggleDrawBound() { this.mDrawBounds = !this.mDrawBounds; }
    setBoundRadius(r) { this.mBoundRadius = r; }

    setTransform(xf) { this.mXform = xf; }
    // #endregion

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

    update() {
        // nothing for now
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
}

export default RigidShape;