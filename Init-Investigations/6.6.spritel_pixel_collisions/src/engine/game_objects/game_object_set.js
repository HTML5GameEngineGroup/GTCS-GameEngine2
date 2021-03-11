"use strict";  // Operate in Strict mode such that variables must be declared before used!

class GameObjectSet {
    constructor() {
        this.mSet = [];
    }

    size() { return this.mSet.length; }

    getObjectAt(index) {
        return this.mSet[index];
    }

    addToSet(obj) {
        this.mSet.push(obj);
    }

    update() {
        let i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].update();
        }
    }

    draw(aCamera) {
        let i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].draw(aCamera);
        }
    }
}

export default GameObjectSet;