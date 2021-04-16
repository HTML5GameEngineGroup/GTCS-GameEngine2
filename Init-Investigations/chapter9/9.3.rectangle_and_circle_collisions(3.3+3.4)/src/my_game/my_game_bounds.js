/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import MyGame from "./my_game_main.js";

var kSpeed = 40;
MyGame.prototype.radomizeVelocity = function()
{
    var i = 0;
    for (i = this.mFirstObject; i<this.mAllObjs.size(); i++) {
        var obj = this.mAllObjs.getObjectAt(i);
        var rigidShape = obj.getRigidBody();
        var x = (Math.random() - 0.5) * kSpeed;
        var y = Math.random() * kSpeed * 0.5;
        rigidShape.setVelocity(x, y);
    }
}

MyGame.prototype.createBounds = function() {
    var x = 15, w = 30, y = 4;
    for (x = 15; x < 120; x+=30) 
        this.platformAt(x, y, w, 0);
    y = 76;
    for (x = 15; x < 120; x+=30) 
        this.platformAt(x, y, w, 180);
       
    x = 2;
    w = 3;
    for (y = 8; y < 90; y+=12) 
        this.wallAt(x, y, w);
    x = 98;
    for (y = 8; y < 90; y+=12) 
        this.wallAt(x, y, w);
    
    var r = new engine.TextureRenderable(this.kTargetTexture);
    this.mTarget = new engine.GameObject(r);
    var xf = r.getXform();
    xf.setSize(1.5, 1.5);
}

MyGame.prototype.wallAt = function (x, y, w) {
    var h = w * 4;
    var p = new engine.TextureRenderable(this.kWallTexture);
    var xf = p.getXform();
    
    var g = new engine.GameObject(p);
    var r = new engine.RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    g.toggleDrawRenderable();
    g.toggleDrawRigidShape();
    
    xf.setSize(w, h);
    xf.setPosition(x, y);
    this.mAllObjs.addToSet(g);
}

MyGame.prototype.platformAt = function (x, y, w, rot) {
    var h = w / 8;
    var p = new engine.TextureRenderable(this.kPlatformTexture);
    var xf = p.getXform();
    
    var g = new engine.GameObject(p);
    var r = new engine.RigidRectangle(xf, w, h);
    g.setRigidBody(r);
    g.toggleDrawRenderable();
    g.toggleDrawRigidShape();
    
    xf.setSize(w, h);
    xf.setPosition(x, y);
    xf.setRotationInDegree(rot);
    this.mAllObjs.addToSet(g);
}

export default MyGame;