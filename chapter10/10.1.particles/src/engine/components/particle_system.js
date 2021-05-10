/*
 * File: particle_system.js 
 * Particle System support
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

let mSystemAcceleration = [30, -50.0];   
    
function getSystemAcceleration() { return mSystemAcceleration; }
function setSystemAcceleration(g) { mSystemAcceleration = g; }

export {getSystemAcceleration, setSystemAcceleration}
