/* 
 * File: particle.js
 * Defines a particle
 */
"use strict";

import * as loop from "../core/loop.js";
import * as particleSystem from "../components/particle_system.js";
import ParticleRenderable from "../renderables/particle_renderable.js";

class Particle {
    constructor(texture, x, y, life) {
        this.kPadding = 0.5;   // for drawing particle bounds
        this.mRenderComponent = new ParticleRenderable(texture);
        this.setPosition(x, y);

        // position control
        this.mVelocity = vec2.fromValues(0, 0);
        this.mAcceleration = particleSystem.getSystemtAcceleration();
        this.mDrag = 0.95;

        // Color control
        this.mDeltaColor = [0, 0, 0, 0];

        // Size control
        this.mSizeDelta = 0;

        // Life control
        this.mCyclesToLive = life;
    }

    drawMarker(aCamera, line) {
        //calculation for the X at the particle position
        let p = this.getPosition();

        line.setFirstVertex(p[0] - this.kPadding, p[1] + this.kPadding);  //TOP LEFT
        line.setSecondVertex(p[0] + this.kPadding, p[1] - this.kPadding); //BOTTOM RIGHT
        line.draw(aCamera);

        line.setFirstVertex(p[0] + this.kPadding, p[1] + this.kPadding);  //TOP RIGHT
        line.setSecondVertex(p[0] - this.kPadding, p[1] - this.kPadding); //BOTTOM LEFT
        line.draw(aCamera);
    }

    draw(aCamera) {
        this.mRenderComponent.draw(aCamera);
    }

    update() {
        this.mCyclesToLive--;

        let dt = loop.getUpdateIntervalInSeconds();

        // Symplectic Euler
        //    v += a * dt
        //    x += v * dt
        let p = this.getPosition();
        vec2.scaleAndAdd(this.mVelocity, this.mVelocity, this.mAcceleration, dt);
        vec2.scale(this.mVelocity, this.mVelocity, this.mDrag);
        vec2.scaleAndAdd(p, p, this.mVelocity, dt);

        // update color
        let c = this.mRenderComponent.getColor();
        vec4.add(c, c, this.mDeltaColor);
    
        // update size
        let xf = this.mRenderComponent.getXform();
        let s = xf.getWidth() * this.mSizeDelta;
        xf.setSize(s, s);
    }

    setFinalColor = function(f) {    
        vec4.sub(this.mDeltaColor, f, this.getColor());
        if (this.mCyclesToLive !== 0) {
            vec4.scale(this.mDeltaColor, this.mDeltaColor, 1/this.mCyclesToLive);
        }
    }
    setColor(c) { this.mRenderComponent.setColor(c); }
    getColor() { return this.mRenderComponent.getColor(); }

    getDrawBounds() { return this.mDrawBounds; }
    setDrawBounds(d) { this.mDrawBounds = d; }

    getPosition() { return this.mRenderComponent.getXform().getPosition(); }
    setPosition(xPos, yPos) { 
        this.mRenderComponent.getXform().setXPos(xPos); 
        this.mRenderComponent.getXform().setYPos(yPos); 
    }

    getSize() { return this.mRenderComponent.getXform().getSize(); }
    setSize(x, y) { this.mRenderComponent.getXform().setSize(x, y); }

    getVelocity() { return this.mVelocity; }
    setVelocity(f) { this.mVelocity = f; }
    getAcceleration() { return this.mAcceleration; }
    setAcceleration(g) { this.mAcceleration = g; }

    setDrag(d) { this.mDrag = d; }
    getDrag() { return this.mDrag; }

    setSizeDelta(d) { this.mSizeDelta = d; }

    hasExpired() { return (this.mCyclesToLive < 0); }
}

export default Particle;