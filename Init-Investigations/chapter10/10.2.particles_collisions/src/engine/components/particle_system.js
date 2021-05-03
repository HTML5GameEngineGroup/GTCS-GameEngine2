/*
 * File: particle_system.js 
 * Particle System support
 */
"use strict";
import Transform from "../utils/transform.js";
import RigidCircle from "../rigid_shapes/rigid_circle.js";
import CollisionInfo from "../rigid_shapes/collision_info.js";

  // Operate in Strict mode such that variables must be declared before used!

let mXform = null;  // for collision with rigid shapes
let mCircleCollider = null;
let mCollisionInfo = null;
let mFrom1to2 = [0, 0];
function init() {
    mXform = new Transform();
    mCircleCollider = new RigidCircle(mXform, 1.0);
    mCollisionInfo = new CollisionInfo();
}

let mSystemtAcceleration = [30, -50.0];   
function getSystemtAcceleration() { return mSystemtAcceleration; }
function setSystemtAcceleration(g) { mSystemtAcceleration = g; }

function resolveCirclePos(circShape, particle) {
    let pos = particle.getPosition();
    let cPos = circShape.getCenter();
    vec2.subtract(mFrom1to2, pos, cPos);
    let dist = vec2.length(mFrom1to2);
    if (dist < circShape.getRadius()) {
        vec2.scale(mFrom1to2, mFrom1to2, 1/dist);
        vec2.scaleAndAdd(pos, cPos, mFrom1to2, circShape.getRadius());
    }
}

function resolveRectPos(rectShape, particle) {
    let s = particle.getSize();
    let p = particle.getPosition();
    mXform.setSize(s[0], s[1]); // referred by mCircleCollision
    mXform.setPosition(p[0], p[1]);  
    if (mCircleCollider.boundTest(rectShape)) {
        if (rectShape.collisionTest(mCircleCollider, mCollisionInfo)) {
            // make sure info is always from rect towards particle
            vec2.subtract(mFrom1to2, mCircleCollider.getCenter(), rectShape.getCenter());
            if (vec2.dot(mFrom1to2, mCollisionInfo.getNormal()) < 0)
                mCircleCollider.adjustPositionBy(mCollisionInfo.getNormal(), -mCollisionInfo.getDepth());
            else
                mCircleCollider.adjustPositionBy(mCollisionInfo.getNormal(), mCollisionInfo.getDepth());
            p = mXform.getPosition();
            particle.setPosition(p[0], p[1]);
        }
    }
}

// objSet: set of GameObjcets (with potential mRigidBody)
// pSet: set of particles (ParticleSet)
function resolveRigidShapeCollision(objSet, pSet) {
    let i, j;
    if ((objSet.size === 0) || (pSet.size === 0))
        return;
    for (i=0; i<objSet.size(); i++) {
        let rigidShape = objSet.getObjectAt(i).getRigidBody();
        for (j = 0; j<pSet.size(); j++) {
            if (rigidShape.getType() == "RigidRectangle")
                resolveRectPos(rigidShape, pSet.getObjectAt(j));
            else if (rigidShape.getType() == "RigidCircle")
                    resolveCirclePos(rigidShape, pSet.getObjectAt(j));
        }
    }
}
export {init,
        getSystemtAcceleration, setSystemtAcceleration, 
        resolveRigidShapeCollision}