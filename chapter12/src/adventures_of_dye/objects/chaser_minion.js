"use strict";

import Minion from "./minion.js";

class ChaserMinion extends Minion {
    constructor(atX, atY, velocity, movementRange, type, texture, normal, lightSet, w, h) {
        super(atX, atY, velocity, movementRange, type, texture, normal, lightSet, w, h);
        this.kOffset = 4.7;
        this.kShootTimer = 90;
        this.setCurrentFrontDir([0, 1]);
        this.getRigidBody().setSpeed(this.kSpeed);

    }

    update(target) {
        super.update(target);
        let p = target.getXform().getPosition();
        this.rotateObjPointTo(p, 0.08);
    }
}

export default ChaserMinion;