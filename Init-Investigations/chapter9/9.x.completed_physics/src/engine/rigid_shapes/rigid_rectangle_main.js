/* 
 * File: rigid_rectangle_main.js
 * 
 *       RigidRectangle class definition file
 */
"use strict";

import RigidShape from "./rigid_shape.js";

class RigidRectangle extends RigidShape {
    constructor(xf, width, height) {
        super(xf);
        this.mType = "RigidRectangle";
        this.mWidth = width;
        this.mHeight = height;
        this.mBoundRadius = Math.sqrt(width * width + height * height) / 2;
        this.mVertex = [];
        this.mFaceNormal = [];

        this.setVertices();
        this.computeFaceNormals();

        this.updateInertia();
    }

    updateInertia() {
        // Expect this.mInvMass to be already inverted!
        if (this.mInvMass === 0) {
            this.mInertia = 0;
        } else {
            //inertia=mass*width^2+height^2
            this.mInertia = (1 / this.mInvMass) * (this.mWidth * this.mWidth + this.mHeight * this.mHeight) / 12;
            this.mInertia = 1 / this.mInertia;
        }
    }

    incShapeSizeBy(dt) {
        this.mHeight += dt;
        this.mWidth += dt;
    }

    adjustPositionBy(v, delta) {
        RigidShape.prototype.adjustPositionBy.call(this, v, delta);
        this.setVertices();
        this.rotateVertices();
    }

    setVertices() {
        let center = this.mXform.getPosition();
        let hw = this.mWidth / 2;
        let hh = this.mHeight / 2;
        //0--TopLeft;1--TopRight;2--BottomRight;3--BottomLeft
        this.mVertex[0] = vec2.fromValues(center[0] - hw, center[1] - hh);
        this.mVertex[1] = vec2.fromValues(center[0] + hw, center[1] - hh);
        this.mVertex[2] = vec2.fromValues(center[0] + hw, center[1] + hh);
        this.mVertex[3] = vec2.fromValues(center[0] - hw, center[1] + hh);
    }

    computeFaceNormals() {
        //0--Top;1--Right;2--Bottom;3--Left
        //mFaceNormal is normal of face toward outside of rectangle    
        for (let i = 0; i < 4; i++) {
            let v = (i + 1) % 4;
            let nv = (i + 2) % 4;
            this.mFaceNormal[i] = vec2.clone(this.mVertex[v]);
            vec2.subtract(this.mFaceNormal[i], this.mFaceNormal[i], this.mVertex[nv]);
            vec2.normalize(this.mFaceNormal[i], this.mFaceNormal[i]);
        }
    }

    rotateVertices() {
        let center = this.mXform.getPosition();
        let r = this.mXform.getRotationInRad();
        for (let i = 0; i < 4; i++) {
            vec2.rotateWRT(this.mVertex[i], this.mVertex[i], r, center);
        }
        this.computeFaceNormals();
    }

    drawAnEdge(i1, i2, aCamera) {
        this.mLine.setFirstVertex(this.mVertex[i1][0], this.mVertex[i1][1]);
        this.mLine.setSecondVertex(this.mVertex[i2][0], this.mVertex[i2][1]);
        this.mLine.draw(aCamera);
    }

    draw(aCamera) {
        super.draw(aCamera);
        this.mLine.setColor([0, 0, 0, 1]);
        let i = 0;
        for (i = 0; i < 4; i++) {
            this.drawAnEdge(i, (i + 1) % 4, aCamera);
        }

        if (this.mDrawBounds) {
            this.mLine.setColor([1, 1, 1, 1]);
            this.drawCircle(aCamera, this.mBoundRadius);
        }
    }

    update() {
        super.update();
        this.setVertices();
        this.rotateVertices();
    }
}

export default RigidRectangle;