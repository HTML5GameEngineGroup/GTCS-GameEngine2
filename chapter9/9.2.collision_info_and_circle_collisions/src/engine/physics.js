/*
 * File: physics.js
 *  
 * core of the physics component
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import CollisionInfo from "./rigid_shapes/collision_info.js";

function processCollision(set, infoSet) {
    let i = 0, j = 0;
    let iToj = [0, 0];
    let info = new CollisionInfo();

    for (i = 0; i < set.size(); i++) {
        let objI = set.getObjectAt(i).getRigidBody();
        for (j = i + 1; j < set.size(); j++) {
            let objJ = set.getObjectAt(j).getRigidBody();
            if (objI.boundTest(objJ)) {
                if (objI.collisionTest(objJ, info)) {
                    // make sure info is always from i towards j
                    vec2.subtract(iToj, objJ.getCenter(), objI.getCenter());
                    if (vec2.dot(iToj, info.getNormal()) < 0)
                        info.changeDir();
                    // for showing off collision info!
                    if (infoSet !== null) {
                        infoSet.push(info);
                        info = new CollisionInfo();
                    }
                }
            }

        }
    }
}

export {
    // Collide
    processCollision
}