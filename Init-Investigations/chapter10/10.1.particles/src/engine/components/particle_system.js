/*
 * File: particle_system.js 
 * Particle System support
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

let mSystemtAcceleration = [30, -50.0];   
    
function getSystemtAcceleration() { return mSystemtAcceleration; }
function setSystemtAcceleration(g) { mSystemtAcceleration = g; }

export {getSystemtAcceleration, setSystemtAcceleration}
