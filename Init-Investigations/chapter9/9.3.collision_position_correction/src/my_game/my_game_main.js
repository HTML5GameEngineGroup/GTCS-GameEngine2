/*
 * File: MyGame.js 
 *       This is the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import Hero from "./objects/hero.js";
import Minion from "./objects/minion.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kPlatformTexture = "assets/platform.png";
        this.kWallTexture = "assets/wall.png";
        this.kTargetTexture = "assets/target.png";
        this.kParticleTexture = "assets/ParticleSystem/particle.png";

        // The camera to view the scene
        this.mCamera = null;

        this.mMsg = null;
        this.mShapeMsg = null;

        this.mAllObjs = null;
        this.mBounds = null;
        this.mCollisionInfos = [];
        this.mHero = null;

        this.mCurrentObj = 0;
        this.mTarget = null;

        // Draw controls
        this.mDrawCollisionInfo = false;
        this.mDrawTexture = false;
        this.mDrawBounds = false;
        this.mDrawRigidShape = true;
    }



    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kPlatformTexture);
        engine.texture.load(this.kWallTexture);
        engine.texture.load(this.kTargetTexture);
        engine.texture.load(this.kParticleTexture);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kPlatformTexture);
        engine.texture.unload(this.kWallTexture);
        engine.texture.unload(this.kTargetTexture);
        engine.texture.unload(this.kParticleTexture);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 40), // position of the camera
            100,                     // width of camera
            [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray
        engine.defaultResources.setGlobalAmbientIntensity(3);

        this.mHero = new Hero(this.kMinionSprite);
        this.mAllObjs = new engine.GameObjectSet();

        this.createBounds();
        this.mFirstObject = this.mAllObjs.size();
        this.mCurrentObj = this.mFirstObject;

        this.mAllObjs.addToSet(this.mHero);
        let y = 70;
        let x = 10;
        for (let i = 1; i <= 5; i++) {
            let m = new Minion(this.kMinionSprite, x, y, ((i % 2) !== 0));
            x += 20;
            this.mAllObjs.addToSet(m);
        }

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(5, 7);
        this.mMsg.setTextHeight(3);

        this.mShapeMsg = new engine.FontRenderable("Shape");
        this.mShapeMsg.setColor([0, 0, 0, 1]);
        this.mShapeMsg.getXform().setPosition(5, 73);
        this.mShapeMsg.setTextHeight(2.5);

        // switch off motion initially to 
        // faciliate examining of collision position correction
        engine.physics.toggleHasMotion();
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        this.mCamera.setViewAndCameraMatrix();

        this.mAllObjs.draw(this.mCamera);

        // for now draw these ...
        for (let i = 0; i < this.mCollisionInfos.length; i++)
            this.mCollisionInfos[i].draw(this.mCamera);
        this.mCollisionInfos = [];

        this.mTarget.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);   // only draw status in the main camera
        this.mShapeMsg.draw(this.mCamera);
    }

    increasShapeSize(obj, delta) {
        let s = obj.getRigidBody();
        let r = s.incShapeSizeBy(delta);
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    kBoundDelta = 0.1;
    update() {
        let msg = "";

        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            engine.physics.togglePositionalCorrection();
        }
        if (engine.input.isKeyClicked(engine.input.keys.V)) {
            engine.physics.toggleHasMotion();
        }
        if (engine.input.isKeyClicked(engine.input.keys.H)) {
            this.radomizeVelocity();
        }

        if (engine.input.isKeyClicked(engine.input.keys.Left)) {
            this.mCurrentObj -= 1;
            if (this.mCurrentObj < this.mFirstObject)
                this.mCurrentObj = this.mAllObjs.size() - 1;
        }
        if (engine.input.isKeyClicked(engine.input.keys.Right)) {
            this.mCurrentObj += 1;
            if (this.mCurrentObj >= this.mAllObjs.size())
                this.mCurrentObj = this.mFirstObject;
        }

        let obj = this.mAllObjs.getObjectAt(this.mCurrentObj);
        if (engine.input.isKeyPressed(engine.input.keys.Y)) {
            this.increasShapeSize(obj, kBoundDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.U)) {
            this.increasShapeSize(obj, -kBoundDelta);
        }

        if (engine.input.isKeyClicked(engine.input.keys.G)) {
            let x = 20 + Math.random() * 60;
            let y = 75;
            let t = Math.random() > 0.5;
            let m = new Minion(this.kMinionSprite, x, y, t);
            if (this.mDrawTexture) // default is false
                m.toggleDrawRenderable();
            if (this.mDrawBounds) // default is false
                m.getRigidBody().toggleDrawBound();
            if (!this.mDrawRigidShape) // default is true
                m.toggleDrawRigidShape();
            this.mAllObjs.addToSet(m);
        }

        obj.keyControl();
        this.drawControlUpdate();
        this.mAllObjs.update(this.mCamera);

        if (this.mDrawCollisionInfo)
            engine.physics.processCollision(this.mAllObjs, this.mCollisionInfos);
        else
            engine.physics.processCollision(this.mAllObjs, null);

        let p = obj.getXform().getPosition();
        this.mTarget.getXform().setPosition(p[0], p[1]);
        msg += "  P(" + engine.physics.getPositionalCorrection() +
            " " + engine.physics.getRelaxationCount() + ")" +
            " V(" + engine.physics.getHasMotion() + ")";
        this.mMsg.setText(msg);

        this.mShapeMsg.setText(obj.getRigidBody().getCurrentState());
    }

    drawControlUpdate() {
        let i;
        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            this.mDrawCollisionInfo = !this.mDrawCollisionInfo;
        }
        if (engine.input.isKeyClicked(engine.input.keys.T)) {
            this.mDrawTexture = !this.mDrawTexture;
            for (i = 0; i < this.mAllObjs.size(); i++) {
                this.mAllObjs.getObjectAt(i).toggleDrawRenderable();
            }
        }
        if (engine.input.isKeyClicked(engine.input.keys.R)) {
            this.mDrawRigidShape = !this.mDrawRigidShape;
            for (i = 0; i < this.mAllObjs.size(); i++) {
                this.mAllObjs.getObjectAt(i).toggleDrawRigidShape();
            }
        }
        if (engine.input.isKeyClicked(engine.input.keys.B)) {
            this.mDrawBounds = !this.mDrawBounds;
            for (i = 0; i < this.mAllObjs.size(); i++) {
                this.mAllObjs.getObjectAt(i).getRigidBody().toggleDrawBound();
            }
        }
    }
}

export default MyGame;