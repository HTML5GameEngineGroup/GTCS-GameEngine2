/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

"use strict";  // Operate in Strict mode such that letiables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Hero from "./objects/hero.js";
import Minion from "./objects/minion.js";


class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kMinionSpriteNormal = "assets/minion_sprite_normal.png";
        this.kBg = "assets/bg.png";
        this.kBgNormal = "assets/bg_normal.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mBg = null;

        this.mMsg = null;
        this.mMatMsg = null;

        // the hero and the support objects
        this.mLgtHero = null;
        this.mIllumHero = null;

        this.mLgtMinion = null;
        this.mIllumMinion = null;

        this.mGlobalLightSet = null;

        this.mBlock1 = null;   // to verify swiitching between shaders is fine
        this.mBlock2 = null;

        this.mLgtIndex = 0;
        this.mLgtRotateTheta = 0;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kBg);
        engine.texture.load(this.kBgNormal);
        engine.texture.load(this.kMinionSpriteNormal);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kBg);
        engine.texture.unload(this.kBgNormal);
        engine.texture.unload(this.kMinionSpriteNormal);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 0, 640, 480]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        // the light
        this._initializeLights();   // defined in MyGame_Lights.js

        // the Background
        let bgR = new engine.IllumRenderable(this.kBg, this.kBgNormal);
        bgR.setElementPixelPositions(0, 1024, 0, 1024);
        bgR.getXform().setSize(100, 100);
        bgR.getXform().setPosition(50, 35);
        bgR.getMaterial().setSpecular([1, 0, 0, 1]);
        let i;
        for (i = 0; i < 4; i++) {
            bgR.addLight(this.mGlobalLightSet.getLightAt(i));   // all the lights
        }
        this.mBg = new engine.GameObject(bgR);

        // 
        // the objects
        this.mIllumHero = new Hero(this.kMinionSprite, this.kMinionSpriteNormal, 15, 50);
        this.mLgtHero = new Hero(this.kMinionSprite, null, 80, 50);
        this.mIllumMinion = new Minion(this.kMinionSprite, this.kMinionSpriteNormal, 17, 15);
        this.mLgtMinion = new Minion(this.kMinionSprite, null, 87, 15);
        for (i = 0; i < 4; i++) {
            this.mIllumHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
            this.mLgtHero.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
            this.mIllumMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
            this.mLgtMinion.getRenderable().addLight(this.mGlobalLightSet.getLightAt(i));
        }

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(1, 2);
        this.mMsg.setTextHeight(3);

        this.mMatMsg = new engine.FontRenderable("Status Message");
        this.mMatMsg.setColor([1, 1, 1, 1]);
        this.mMatMsg.getXform().setPosition(1, 73);
        this.mMatMsg.setTextHeight(3);

        this.mBlock1 = new engine.Renderable();
        this.mBlock1.setColor([1, 0, 0, 1]);
        this.mBlock1.getXform().setSize(5, 5);
        this.mBlock1.getXform().setPosition(30, 50);

        this.mBlock2 = new engine.Renderable();
        this.mBlock2.setColor([0, 1, 0, 1]);
        this.mBlock2.getXform().setSize(5, 5);
        this.mBlock2.getXform().setPosition(70, 50);

        this.mSlectedCh = this.mIllumHero;
        this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
        this.mSelectedChMsg = "H:";
    }


    _drawCamera(camera) {
        // Step A: set up the View Projection matrix
        camera.setViewAndCameraMatrix();
        // Step B: Now draws each primitive
        this.mBg.draw(camera);
        this.mBlock1.draw(camera);
        this.mLgtMinion.draw(camera);
        this.mIllumHero.draw(camera);
        this.mBlock2.draw(camera);
        this.mLgtHero.draw(camera);
        this.mIllumMinion.draw(camera);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Draw with all three cameras
        this._drawCamera(this.mCamera);
        this.mMsg.draw(this.mCamera);   // only draw status in the main camera
        this.mMatMsg.draw(this.mCamera);
    }

    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.mCamera.update();  // to ensure proper interpolated movement effects

        this.mIllumMinion.update(); // ensure sprite animation
        this.mLgtMinion.update();

        this.mIllumHero.update();  // allow keyboard control to move

        // control the selected light
        let msg = "L=" + this.mLgtIndex + " ";
        msg += this._lightControl();
        this.mMsg.setText(msg);

        msg = this._selectCharacter();
        msg += this._materialControl();
        this.mMatMsg.setText(msg);

    }

    _selectCharacter() {
        // select which character to work with
        if (engine.input.isKeyClicked(engine.input.keys.Five)) {
            this.mSlectedCh = this.mIllumMinion;
            this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
            this.mSelectedChMsg = "L:";
        }
        if (engine.input.isKeyClicked(engine.input.keys.Six)) {
            this.mSlectedCh = this.mIllumHero;
            this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
            this.mSelectedChMsg = "H:";
        }
        return this.mSelectedChMsg;
    }

    // #region: Creation and initialization of Light
    _createALight(type, pos, dir, color, n, f, inner, outer, intensity, dropOff) {
        let light = new engine.Light();
        light.setLightType(type);
        light.setColor(color);
        light.setXPos(pos[0]);
        light.setYPos(pos[1]);
        light.setZPos(pos[2]);
        light.setDirection(dir);
        light.setNear(n);
        light.setFar(f);
        light.setInner(inner);
        light.setOuter(outer);
        light.setIntensity(intensity);
        light.setDropOff(dropOff);

        return light;
    }

    _initializeLights() {
        this.mGlobalLightSet = new engine.LightSet();

        let l = this._createALight(engine.eLightType.ePointLight,
            [15, 50, 5],         // position
            [0, 0, -1],          // Direction 
            [0.6, 1.0, 0.0, 1],  // some color
            8, 20,               // near and far distances
            0.1, 0.2,            // inner and outer cones
            5,                   // intensity
            1.0                  // drop off
        );
        this.mGlobalLightSet.addToSet(l);

        l = this._createALight(engine.eLightType.eDirectionalLight,
            [15, 50, 4],           // position (not used by directional)
            [-0.2, -0.2, -1],      // Pointing direction upwards
            [0.7, 0.7, 0.0, 1],    // color
            500, 500,              // near anf far distances: essentially switch this off
            0.1, 0.2,              // inner and outer cones
            2,                     // intensity
            1.0                    // drop off
        );
        this.mGlobalLightSet.addToSet(l);

        l = this._createALight(engine.eLightType.eSpotLight,
            [80, 18, 10],            // Right minion position
            [-0.07, 0, -1],     // direction
            [0.5, 0.5, 0.5, 1],     // color
            100, 100,                  // near and far distances
            1.65, 1.7,               // inner outter angles (in radius)
            5,                     // intensity
            1.2                     // drop off
        );
        this.mGlobalLightSet.addToSet(l);

        l = this._createALight(engine.eLightType.eSpotLight,
            [64, 43, 10],            // Center of camera 
            [0.0, 0.03, -1],
            [0.8, 0.8, 0.2, 1],      //  color
            100, 100,                   // near and far distances
            1.9, 2.0,                // inner and outer cones
            2,                       // intensity
            1                      // drop off
        );
        this.mGlobalLightSet.addToSet(l);
    }
    // #endregion 

    // #region: Light Control 
    _lightControl() {
        let dirDelta = 0.005;
        let delta = 0.2;
        let msg = "";
        // player select which light to work 
        this._selectLight();

        // manipulate the light
        let lgt = this.mGlobalLightSet.getLightAt(this.mLgtIndex);
        let p = lgt.getPosition();
        let d = lgt.getDirection();
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            if (engine.input.isKeyPressed(engine.input.keys.Space)) {
                d[0] -= dirDelta;
                lgt.setDirection(d);
            } else {
                lgt.setXPos(p[0] - delta);
            }
        }
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            if (engine.input.isKeyPressed(engine.input.keys.Space)) {
                d[0] += dirDelta;
                lgt.setDirection(d);
            } else {
                lgt.setXPos(p[0] + delta);
            }
        }
        if (engine.input.isKeyPressed(engine.input.keys.Up)) {
            if (engine.input.isKeyPressed(engine.input.keys.Space)) {
                d[1] += dirDelta;
                lgt.setDirection(d);
            } else {
                lgt.setYPos(p[1] + delta);
            }
        }
        if (engine.input.isKeyPressed(engine.input.keys.Down)) {
            if (engine.input.isKeyPressed(engine.input.keys.Space)) {
                d[1] -= dirDelta;
                lgt.setDirection(d);
            } else {
                lgt.setYPos(p[1] - delta);
            }
        }
        if (engine.input.isKeyPressed(engine.input.keys.Z)) {
            if (engine.input.isKeyPressed(engine.input.keys.Space)) {
                d[2] += dirDelta;
                lgt.setDirection(d);
            } else {
                lgt.setZPos(p[2] + delta);
            }
        }
        if (engine.input.isKeyPressed(engine.input.keys.X)) {
            if (engine.input.isKeyPressed(engine.input.keys.Space)) {
                d[2] -= dirDelta;
                lgt.setDirection(d);
            } else {
                lgt.setZPos(p[2] - delta);
            }
        }

        // radius
        if (engine.input.isKeyPressed(engine.input.keys.C)) {
            lgt.setInner(lgt.getInner() + (delta * 0.01)); // convert to radian
        }
        if (engine.input.isKeyPressed(engine.input.keys.V)) {
            lgt.setInner(lgt.getInner() - (delta * 0.01)); // convert to radian
        }
        if (engine.input.isKeyPressed(engine.input.keys.B)) {
            lgt.setOuter(lgt.getOuter() + (delta * 0.01)); // convert to radian
        }
        if (engine.input.isKeyPressed(engine.input.keys.N)) {
            lgt.setOuter(lgt.getOuter() - (delta * 0.01)); // convert to radian
        }

        // Intensity
        if (engine.input.isKeyPressed(engine.input.keys.K)) {
            lgt.setIntensity(lgt.getIntensity() + delta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.L)) {
            lgt.setIntensity(lgt.getIntensity() - delta);
        }

        // on/off
        if (engine.input.isKeyClicked(engine.input.keys.H)) {
            lgt.setLightTo(!lgt.isLightOn());
        }

        let lMsg = "";
        if (engine.input.isKeyPressed(engine.input.keys.Space)) {
            lMsg = this._printVec3("D", d);
        } else {
            lMsg = this._printVec3("P", p);
        }
        msg = "On(" + lgt.isLightOn() + ") " + lMsg +
            "R(" + lgt.getInner().toPrecision(3) + "/" + lgt.getOuter().toPrecision(3) + ") " +
            "I(" + lgt.getIntensity().toPrecision(3) + ")";

        return msg;
    }

    _selectLight() {
        // select which light to work with
        if (engine.input.isKeyClicked(engine.input.keys.Zero)) {
            this.mLgtIndex = 0;
        }
        if (engine.input.isKeyClicked(engine.input.keys.One)) {
            this.mLgtIndex = 1;
        }
        if (engine.input.isKeyClicked(engine.input.keys.Two)) {
            this.mLgtIndex = 2;
        }
        if (engine.input.isKeyClicked(engine.input.keys.Three)) {
            this.mLgtIndex = 3;
        }
    }

    _printVec3(msg, p) {
        return msg + "(" + p[0].toPrecision(2) + " " + p[1].toPrecision(2) + " " + p[2].toPrecision(2) + ") ";
    }
    // #endregion

    // #region: Select of material channel and edit the selected channel
    _materialControl() {
        let delta = 0.01;
        let msg = "";

        // player select which object and material channgel to work 
        this._selectMaterialChannel();

        // manipulate the selected component Ambient, Diffuse, Specular
        if (engine.input.isKeyPressed(engine.input.keys.E)) {
            this.mMaterialCh[0] += delta;
        }
        if (engine.input.isKeyPressed(engine.input.keys.R)) {
            this.mMaterialCh[0] -= delta;
        }
        if (engine.input.isKeyPressed(engine.input.keys.T)) {
            this.mMaterialCh[1] += delta;
        }
        if (engine.input.isKeyPressed(engine.input.keys.Y)) {
            this.mMaterialCh[1] -= delta;
        }
        if (engine.input.isKeyPressed(engine.input.keys.U)) {
            this.mMaterialCh[2] += delta;
        }
        if (engine.input.isKeyPressed(engine.input.keys.I)) {
            this.mMaterialCh[2] -= delta;
        }

        // shinningess
        let mat = this.mSlectedCh.getRenderable().getMaterial();
        if (engine.input.isKeyPressed(engine.input.keys.O)) {
            mat.setShininess(mat.getShininess() + delta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.P)) {
            mat.setShininess(mat.getShininess() - delta);
        }

        msg += "n(" + mat.getShininess().toPrecision(2) + ")" +
            this._printVec3("D", mat.getDiffuse()) +
            this._printVec3("S", mat.getSpecular()) +
            this._printVec3("A", mat.getAmbient());

        return msg;
    }

    _selectMaterialChannel() {
        // select which character to work with
        if (engine.input.isKeyClicked(engine.input.keys.Seven)) {
            this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getAmbient();
        }
        if (engine.input.isKeyClicked(engine.input.keys.Eight)) {
            this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getDiffuse();
        }
        if (engine.input.isKeyClicked(engine.input.keys.Nine)) {
            this.mMaterialCh = this.mSlectedCh.getRenderable().getMaterial().getSpecular();
        }
    }
    // #endregion 
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start()
}