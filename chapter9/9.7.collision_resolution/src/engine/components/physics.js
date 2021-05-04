/*
 * File: physics.js
 *  
 * core of the physics component
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import CollisionInfo from "../rigid_shapes/collision_info.js";

let mSystemtAcceleration = [0, -20];        // system-wide default acceleration
let mPosCorrectionRate = 0.8;               // percentage of separation to project objects
let mRelaxationCount = 15;                  // number of relaxation iteration

let mCorrectPosition = true;
let mHasMotion = true;

// getters and setters
function getSystemAcceleration() { return mSystemtAcceleration; }

function getPositionalCorrection() { return mCorrectPosition; }
function togglePositionalCorrection() { mCorrectPosition = !mCorrectPosition; }

function getHasMotion() { return mHasMotion; }
function toggleHasMotion() { mHasMotion = !mHasMotion; }

function getRelaxationCount() { return mRelaxationCount; }
function incRelaxationCount(dc) { mRelaxationCount += dc; }


function positionalCorrection(s1, s2, collisionInfo) {
    if (!mCorrectPosition)
        return;

    let s1InvMass = s1.getInvMass();
    let s2InvMass = s2.getInvMass();

    let num = collisionInfo.getDepth() / (s1InvMass + s2InvMass) * mPosCorrectionRate;
    let correctionAmount = [0, 0];
    vec2.scale(correctionAmount, collisionInfo.getNormal(), num);
    s1.adjustPositionBy(correctionAmount, -s1InvMass);
    s2.adjustPositionBy(correctionAmount, s2InvMass);
}

function resolveCollision(s1, s2, collisionInfo) {
    let n = collisionInfo.getNormal();

    let v1 = s1.getVelocity();
    let v2 = s2.getVelocity();
    let relativeVelocity = [0, 0];
    vec2.subtract(relativeVelocity, v2, v1);

    // Relative velocity in normal direction
    let rVelocityInNormal = vec2.dot(relativeVelocity, n);

    //if objects moving apart ignore
    if (rVelocityInNormal > 0) {
        return;
    }

    // compute and apply response impulses for each object    
    let newRestituion = Math.min(s1.getRestitution(), s2.getRestitution());
    let newFriction = Math.min(s1.getFriction(), s2.getFriction());

    // Calc impulse scalar
    // the formula of jN can be found in http://www.myphysicslab.com/collision.html
    let jN = -(1 + newRestituion) * rVelocityInNormal;
    jN = jN / (s1.getInvMass() + s2.getInvMass());

    //impulse is in direction of normal ( from s1 to s2)
    let impulse = [0, 0];
    vec2.scale(impulse, n, jN);
    // impulse = F dt = m * ?v
    // ?v = impulse / m
    vec2.scaleAndAdd(s1.getVelocity(), s1.getVelocity(), impulse, -s1.getInvMass());
    vec2.scaleAndAdd(s2.getVelocity(), s2.getVelocity(), impulse, s2.getInvMass());

    let tangent = [0, 0];
    vec2.scale(tangent, n, rVelocityInNormal);
    vec2.subtract(tangent, tangent, relativeVelocity);
    vec2.normalize(tangent, tangent);

    let rVelocityInTangent = vec2.dot(relativeVelocity, tangent);
    let jT = -(1 + newRestituion) * rVelocityInTangent * newFriction;
    jT = jT / (s1.getInvMass() + s2.getInvMass());

    //friction should less than force in normal direction
    if (jT > jN) {
        jT = jN;
    }

    //impulse is from s1 to s2 (in opposite direction of velocity)
    vec2.scale(impulse, tangent, jT);
    vec2.scaleAndAdd(s1.getVelocity(), s1.getVelocity(), impulse, -s1.getInvMass());
    vec2.scaleAndAdd(s2.getVelocity(), s2.getVelocity(), impulse, s2.getInvMass());
}

function processCollision(set, infoSet) {
    let i = 0, j = 0, r = 0;
    let iToj = [0, 0];
    let info = new CollisionInfo();
    for (r = 0; r < mRelaxationCount; r++) {
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
                            positionalCorrection(objI, objJ, info);
                            resolveCollision(objI, objJ, info);
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
}

export {
    // Physics system attributes
    getSystemAcceleration,

    togglePositionalCorrection,
    getPositionalCorrection,

    getRelaxationCount,
    incRelaxationCount,
    
    getHasMotion,
    toggleHasMotion,

    // Collide and response
    processCollision
}