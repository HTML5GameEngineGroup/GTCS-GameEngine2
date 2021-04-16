/* 
 * File: collision_info.js
 *      normal: vector upon which collision interpenetrates
 *      depth: how much penetration
 */
"use strict";

import LineRenderable from "../renderables/line_renderable.js";

class CollisionInfo {
    constructor() {
        this.mDepth = 0;
        this.mNormal = vec2.fromValues(0, 0);
        this.mStart = vec2.fromValues(0, 0);
        this.mEnd = vec2.fromValues(0, 0);

        this.mLine = new LineRenderable();
        this.mLine.setColor([1, 0, 1, 1]);
        this.mLine.setDrawVertices(true);
        this.mLine.setPointSize(5);
    }

    getDepth() { return this.mDepth; }
    setDepth(s) { this.mDepth = s; }

    getNormal() { return this.mNormal; }
    setNormal(s) { this.mNormal = s; } 

    getStart() { return this.mStart; }
    getEnd() { return this.mEnd; }

    setInfo(d, n, s) {
        this.mDepth = d;
        this.mNormal[0] = n[0];
        this.mNormal[1] = n[1];
        this.mStart[0] = s[0];
        this.mStart[1] = s[1];
        vec2.scaleAndAdd(this.mEnd, s, n, d);
    }

    changeDir() {
        vec2.scale(this.mNormal, this.mNormal, -1);
        let n = this.mStart;
        this.mStart = this.mEnd;
        this.mEnd = n;
    }

    draw(aCamera) {
        this.mLine.setFirstVertex(this.mStart[0], this.mStart[1]);
        this.mLine.setSecondVertex(this.mEnd[0], this.mEnd[1]);
        this.mLine.draw(aCamera);
    }
}

export default CollisionInfo;