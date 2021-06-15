/* 
 * File: rigid_rectangle_circle_collision.js
 *
 *       Add circle/rectangle collision function to RigidRectangle
 */
"use strict";

import RigidRectangle from "./rigid_rectangle_collision.js";

/**
 * Determines if there is collision between the shapes
 * @memberOf RigidRectangle
 * @param {float[]} v The rectangle vertex that is closest to the center of the circle
 * @param {float[]} cirCenter The center of the circle
 * @param {float} r The radius of the circle
 * @param {CollisionInfo} info Used to store the collision info
 * @returns {Boolean} If there is collision between the 2 shapes
 */
RigidRectangle.prototype.checkCircRecVertex = function(v, cirCenter, r, info) {
    //the center of circle is in corner region of mVertex[nearestEdge]
    let dis = vec2.length(v);
    //compare the distance with radius to decide collision
    if (dis > r)
        return false;
    let radiusVec = [0, 0];
    let ptAtCirc = [0, 0];
    vec2.scale(v, v, 1/dis); // normalize
    vec2.scale(radiusVec, v, -r);
    vec2.add(ptAtCirc, cirCenter, radiusVec);
    info.setInfo(r - dis, v, ptAtCirc);
    return true;
}

/**
 * Check for collision between RigidRectangle and Circle
 * @param {Circle} otherCir circle to check for collision status against
 * @param {CollisionInfo} collisionInfo Where the Collision Info is stored
 * @returns {Boolean} true if collision occurs
 * @memberOf RigidRectangle
 */
RigidRectangle.prototype.collideRectCirc = function (otherCir, collisionInfo) {
    let outside = false;
    let bestDistance = -Number.MAX_VALUE;
    let nearestEdge = 0; 
    let vToC = [0, 0];
    let projection = 0;
    let i = 0;
    let cirCenter = otherCir.getCenter();
    
    // Step A: Compute the nearest edge
    while ((!outside) && (i<4)) {
        //find the nearest face for center of circle        
        vec2.subtract(vToC, cirCenter, this.mVertex[i]);
        projection = vec2.dot(vToC, this.mFaceNormal[i]);
        if (projection > bestDistance) {
            outside = (projection > 0); // if projection < 0, inside
            bestDistance = projection;
            nearestEdge = i;
        }
        i++;
    }
    let dis;
    let radiusVec = [0, 0];
    let ptAtCirc = [0, 0];
    
    if (!outside) { // inside
        // Step B: The center of circle is inside of rectangle
        vec2.scale(radiusVec, this.mFaceNormal[nearestEdge], otherCir.mRadius);
        dis = otherCir.mRadius - bestDistance; // bestDist is -ve
        vec2.subtract(ptAtCirc, cirCenter, radiusVec);
        collisionInfo.setInfo(dis, this.mFaceNormal[nearestEdge], ptAtCirc);
        return true;
    }
    
    //the center of circle is outside of rectangle

    //v1 is from left vertex of face to center of circle 
    //v2 is from left vertex of face to right vertex of face
    let v1 = [0, 0], v2 = [0, 0];
    vec2.subtract(v1, cirCenter, this.mVertex[nearestEdge]);
    vec2.subtract(v2, this.mVertex[(nearestEdge + 1) % 4], this.mVertex[nearestEdge]);
    let dot = vec2.dot(v1, v2);

    if (dot < 0) {
        // Step C1: In Region R1
        return this.checkCircRecVertex(v1, cirCenter, otherCir.mRadius, collisionInfo);
    } else {
        // Either in Region R2 or R3
        
        //v1 is from right vertex of face to center of circle 
        //v2 is from right vertex of face to left vertex of face
        vec2.subtract(v1, cirCenter, this.mVertex[(nearestEdge + 1) % 4]);
        vec2.scale(v2, v2, -1);
        dot = vec2.dot(v1, v2); 
        if (dot < 0) {
            // Step C2: In Region R2
            return this.checkCircRecVertex(v1, cirCenter, otherCir.mRadius, collisionInfo);
        } else {
            // Step C3: In Region R3 
            if (bestDistance < otherCir.mRadius) {
                vec2.scale(radiusVec, this.mFaceNormal[nearestEdge], otherCir.mRadius);
                dis = otherCir.mRadius - bestDistance;
                vec2.subtract(ptAtCirc, cirCenter, radiusVec);
                collisionInfo.setInfo(dis, this.mFaceNormal[nearestEdge], ptAtCirc);
                return true;
            } else {
                return false;
            }
        }
    }
    return true;
}

export default RigidRectangle;