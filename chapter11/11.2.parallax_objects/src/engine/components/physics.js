/*
 * File: physics.js
 *  
 * core of the physics component
 * 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import CollisionInfo from "../rigid_shapes/collision_info.js";

let mSystemAcceleration = [0, -20];        // system-wide default acceleration
let mPosCorrectionRate = 0.8;               // percentage of separation to project objects
let mRelaxationCount = 15;                  // number of relaxation iteration

let mCorrectPosition = true;
let mHasMotion = true;

// getters and setters
function getSystemAcceleration() { return vec2.clone(mSystemAcceleration); }
function setSystemAcceleration(x, y) {
    mSystemAcceleration[0] = x;
    mSystemAcceleration[1] = y;
}

function getPositionalCorrection() { return mCorrectPosition; }
function togglePositionalCorrection() { mCorrectPosition = !mCorrectPosition; }

function getHasMotion() { return mHasMotion; }
function toggleHasMotion() { mHasMotion = !mHasMotion; }

function getRelaxationCount() { return mRelaxationCount; }
function incRelaxationCount(dc) { mRelaxationCount += dc; }

let mS1toS2 = [0, 0];
let mCInfo = new CollisionInfo();

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

    //the direction of collisionInfo is always from s1 to s2
    //but the Mass is inverse, so start scale with s2 and end scale with s1
    let invSum = 1 / (s1.getInvMass() + s2.getInvMass());
    let start = [0, 0], end = [0, 0], p = [0, 0];
    vec2.scale(start, collisionInfo.getStart(), s2.getInvMass() * invSum);
    vec2.scale(end, collisionInfo.getEnd(), s1.getInvMass() * invSum);
    vec2.add(p, start, end);

    //r is vector from center of object to collision point
    let r1 = [0, 0], r2 = [0, 0];
    vec2.subtract(r1, p, s1.getCenter());
    vec2.subtract(r2, p, s2.getCenter());

    //newV = V + mAngularVelocity cross R
    let v1 = [-1 * s1.getAngularVelocity() * r1[1],
    s1.getAngularVelocity() * r1[0]];
    vec2.add(v1, v1, s1.getVelocity());

    let v2 = [-1 * s2.getAngularVelocity() * r2[1],
    s2.getAngularVelocity() * r2[0]];
    vec2.add(v2, v2, s2.getVelocity());

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

    //R cross N
    let R1crossN = r1[0] * n[1] - r1[1] * n[0]; // r1 cross n
    let R2crossN = r2[0] * n[1] - r2[1] * n[0]; // r2 cross n

    // Calc impulse scalar
    // the formula of jN can be found in http://www.myphysicslab.com/collision.html
    let jN = -(1 + newRestituion) * rVelocityInNormal;
    jN = jN / (s1.getInvMass() + s2.getInvMass() +
        R1crossN * R1crossN * s1.getInertia() +
        R2crossN * R2crossN * s2.getInertia());

    //impulse is in direction of normal ( from s1 to s2)
    let impulse = [0, 0];
    vec2.scale(impulse, n, jN);
    // impulse = F dt = m * ?v
    // ?v = impulse / m
    vec2.scaleAndAdd(s1.getVelocity(), s1.getVelocity(), impulse, -s1.getInvMass());
    vec2.scaleAndAdd(s2.getVelocity(), s2.getVelocity(), impulse, s2.getInvMass());

    s1.setAngularVelocityDelta(-R1crossN * jN * s1.getInertia());
    s2.setAngularVelocityDelta(R2crossN * jN * s2.getInertia());

    let tangent = [0, 0];
    vec2.scale(tangent, n, rVelocityInNormal);
    vec2.subtract(tangent, tangent, relativeVelocity);
    vec2.normalize(tangent, tangent);

    let R1crossT = r1[0] * tangent[1] - r1[1] * tangent[0]; // r1.cross(tangent);
    let R2crossT = r2[0] * tangent[1] - r2[1] * tangent[0]; // r2.cross(tangent);
    let rVelocityInTangent = vec2.dot(relativeVelocity, tangent);

    let jT = -(1 + newRestituion) * rVelocityInTangent * newFriction;
    jT = jT / (s1.getInvMass() + s2.getInvMass() +
        R1crossT * R1crossT * s1.getInertia() +
        R2crossT * R2crossT * s2.getInertia());

    //friction should less than force in normal direction
    if (jT > jN) {
        jT = jN;
    }

    //impulse is from s1 to s2 (in opposite direction of velocity)
    vec2.scale(impulse, tangent, jT);
    vec2.scaleAndAdd(s1.getVelocity(), s1.getVelocity(), impulse, -s1.getInvMass());
    vec2.scaleAndAdd(s2.getVelocity(), s2.getVelocity(), impulse, s2.getInvMass());

    s1.setAngularVelocityDelta(-R1crossT * jT * s1.getInertia());
    s2.setAngularVelocityDelta(R2crossT * jT * s2.getInertia());
}

// collide two rigid shapes
function collideShape(s1, s2, infoSet = null) {
    let hasCollision = false;
    if ((s1 !== s2) && ((s1.getInvMass() !== 0) || (s2.getInvMass() !== 0))) {
        if (s1.boundTest(s2)) {
            hasCollision = s1.collisionTest(s2, mCInfo);
            if (hasCollision) {
                // make sure mCInfo is always from s1 towards s2
                vec2.subtract(mS1toS2, s2.getCenter(), s1.getCenter());
                if (vec2.dot(mS1toS2, mCInfo.getNormal()) < 0)
                    mCInfo.changeDir();
                positionalCorrection(s1, s2, mCInfo);
                resolveCollision(s1, s2, mCInfo);
                // for showing off collision mCInfo!
                            if (infoSet !== null) {
                    infoSet.push(mCInfo);
                    mCInfo = new CollisionInfo();
                            }
                        }
                    }
                }
    return hasCollision;
}

// collide a given GameObject with a GameObjectSet
function processObjToSet(obj, set, infoSet = null) {
    let j = 0, r = 0;
    let hasCollision = false;
    let s1 = obj.getRigidBody();
    for (r = 0; r < mRelaxationCount; r++) {
        for (j = 0; j < set.size(); j++) {
            let s2 = set.getObjectAt(j).getRigidBody();
            hasCollision = collideShape(s1, s2, infoSet) || hasCollision;
        }
    }
    return hasCollision;
}

// collide between all objects in two different GameObjectSets
function processSetToSet(set1, set2, infoSet = null) {
    let i = 0, j = 0, r = 0;
    let hasCollision = false;
    for (r = 0; r < mRelaxationCount; r++) {
        for (i = 0; i < set1.size(); i++) {
            let s1 = set1.getObjectAt(i).getRigidBody();
            for (j = 0; j < set2.size(); j++) {
                let s2 = set2.getObjectAt(j).getRigidBody();
                hasCollision = collideShape(s1, s2, infoSet) || hasCollision;
            }
        }
    }
    return hasCollision;
                }

// collide all objects in the GameObjectSet with themselves
function processSet(set, infoSet = null) {
    let i = 0, j = 0, r = 0;
    let hasCollision = false;
    for (r = 0; r < mRelaxationCount; r++) {
        for (i = 0; i < set.size(); i++) {
            let s1 = set.getObjectAt(i).getRigidBody();
            for (j = i + 1; j < set.size(); j++) {
                let s2 = set.getObjectAt(j).getRigidBody();
                hasCollision = collideShape(s1, s2, infoSet) || hasCollision;
            }
        }
    }
    return hasCollision;
}

export {
    // Physics system attributes
    getSystemAcceleration, setSystemAcceleration,


    togglePositionalCorrection,
    getPositionalCorrection,

    getRelaxationCount,
    incRelaxationCount,
    
    getHasMotion,
    toggleHasMotion,

    // collide and response two shapes 
    collideShape,

    // Collide
    processSet, processObjToSet, processSetToSet
}