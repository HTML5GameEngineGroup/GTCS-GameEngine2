/*
 * File: BlueLevel.js 
 * This is the logic of our game. 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// Engine Core stuff
import * as audio from '../Engine/Core/Resources/Engine_AudioClips.js'
import * as textFileLoader from '../Engine/Core/Resources/Engine_TextFileLoader.js'
import * as input from '../Engine/Core/Engine_Input.js'
import * as core from '../Engine/Core/Engine_Core.js'
import * as loop from '../Engine/Core/Engine_GameLoop.js'

// Engine utility stuff
import Camera from '../Engine/Camera.js'
import Scene from '../Engine/Scene.js'
import Transform from '../Engine/Transform.js'
import SimpleShader from '../Engine/SimpleShader.js'
import Renderable from '../Engine/Renderable.js'

// Local stuff
import MyGame from './MyGame.js'
import SceneFileParser from './Util/SceneFileParser.js'

class BlueLevel extends Scene {
    constructor() {
        super();
        
        // audio clips: supports both mp3 and wav formats
        this.kBgClip = "assets/sounds/BGClip.mp3";
        this.kCue = "assets/sounds/BlueLevel_cue.wav";

        // scene file name
        this.kSceneFile = "assets/BlueLevel.xml";
        // all squares
        this.mSqSet = [];        // these are the Renderable objects

        // The camera to view the scene
        this.mCamera = null;
    }


    loadScene() {
        // load the scene file
        textFileLoader.load(this.kSceneFile, textFileLoader.eTextFileType.eXMLFile);

        // loads the audios
        audio.load(this.kBgClip);
        audio.load(this.kCue);
    };

    unloadScene() {
        // stop the background audio
        audio.stopBackground();

        // unload the scene flie and loaded resources
        textFileLoader.unload(this.kSceneFile);
        audio.unload(this.kBgClip);
        audio.unload(this.kCue);

        let nextLevel = new MyGame();  // load the next level
        core.startScene(nextLevel);
    };

    init() {
        let sceneParser = new SceneFileParser(this.kSceneFile);

        // Step A: Read in the camera
        this.mCamera = sceneParser.parseCamera();

        // Step B: Read all the squares
        sceneParser.parseSquares(this.mSqSet);

        // now start the bg music ...
        audio.playBackground(this.kBgClip);
    };

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setupViewProjection();

        // Step  C: draw all the squares
        let i;
        for (i = 0; i < this.mSqSet.length; i++) {
            this.mSqSet[i].draw(this.mCamera.getVPMatrix());
        }
    };

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // For this very simple game, let's move the first square
        let xform = this.mSqSet[1].getXform();
        let deltaX = 0.05;

        /// Move right and swap ovre
        if (input.isKeyPressed(input.kKeys.Right)) {
            audio.playACue(this.kCue);
            xform.incXPosBy(deltaX);
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(12, 60);
            }
        }

        // Step A: test for white square movement
        if (input.isKeyPressed(input.kKeys.Left)) {
            audio.playACue(this.kCue);
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 11) { // this is the left-boundary
                loop.stopLoop();
            }
        }
    };
}

export default BlueLevel;