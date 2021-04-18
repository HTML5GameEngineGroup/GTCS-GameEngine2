/*
 * File: physics.js
 *  
 * core of the physics component
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import CollisionInfo from "./collision_info.js";

let mSystemtAcceleration = [0, -20];        // system-wide default acceleration
let mHasMotion = true;

// getters and setters
function getSystemAcceleration() { return mSystemtAcceleration; }

function getHasMotion() { return mHasMotion; }
function toggleHasMotion() { mHasMotion = !mHasMotion; }

function processCollision(set, infoSet) {
    let i = 0, j = 0;
    let iToj = [0, 0];
    let info = new CollisionInfo();

    for (i = 0; i < set.size(); i++) {
        let objI = set.getObjectAt(i).getRigidBody();
        for (j = i + 1; j < set.size(); j++) {
            let objJ = set.getObjectAt(j).getRigidBody();
            if ((objI.getInvMass() !== 0) || (objJ.getInvMass() !== 0)) {
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
}

export {
    // Physics system attributes
    getSystemAcceleration,

    getHasMotion,
    toggleHasMotion,

    // Collision
    processCollision
}