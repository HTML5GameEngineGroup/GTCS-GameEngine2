/* 
 * File: rigid_circle_main.js
 * 
 *       Rigid circle class definition file
 */
"use strict";

import RigidShape from "./rigid_shape.js";

class RigidCircle extends RigidShape {
    constructor(xf, radius) {
        super(xf);
        this.mType = "RigidCircle";
        this.mRadius = radius;
        this.mBoundRadius = radius;
    }

    incShapeSizeBy(dt) { 
        this.mRadius += dt; 
        this.mBoundRadius = this.mRadius;
    }

    draw(aCamera) {
        super.draw(aCamera);

        // kNumSides forms the circle.
        this.mLine.setColor([0, 0, 0, 1]);
        this.drawCircle(aCamera, this.mRadius);

        let p = this.mXform.getPosition();
        let u = [p[0], p[1] + this.mBoundRadius];
        // angular motion
        vec2.rotateWRT(u, u, this.mXform.getRotationInRad(), p);
        this.mLine.setColor([1, 1, 1, 1]);
        this.mLine.setFirstVertex(p[0], p[1]);
        this.mLine.setSecondVertex(u[0], u[1]);
        this.mLine.draw(aCamera);

        if (this.mDrawBounds)
            this.drawCircle(aCamera, this.mBoundRadius);
    }

    getRadius() { return this.mRadius; }

    setTransform(xf) {
        super.setTransform(xf);
        this.mRadius = xf.getWidth();  // assume width and height are the same
    }
}

export default RigidCircle;