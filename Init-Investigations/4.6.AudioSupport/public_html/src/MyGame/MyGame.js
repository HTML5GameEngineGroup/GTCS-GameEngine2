/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// Engine Core stuff
import engine from '../Engine/index.js'
   

// User stuff
import BlueLevel from './BlueLevel.js'


class MyGame extends engine.Scene {
    
    constructor() {
        super();
        
        // audio clips: supports both mp3 and wav formats
       this.kBgClip = "assets/sounds/BGClip.mp3";
       this.kCue = "assets/sounds/MyGame_cue.wav";

       // The camera to view the scene
       this.mCamera = null;

       // the hero and the support objects
       this.mHero = null;
       this.mSupport = null;
   }

    loadScene() {
       // loads the audios
        engine.audio.load(this.kBgClip);
        engine.audio.load(this.kCue);
    };


    unloadScene() {
        // Step A: Game loop not running, unload all assets
        // stop the background audio
        engine.audio.stopBackground();

        // unload the scene resources
        // gEngine.AudioClips.unloadAudio(this.kBgClip);
        //      You know this clip will be used elsewhere in the game
        //      So you decide to not unload this clip!!
        engine.audio.unload(this.kCue);

        // Step B: starts the next level
        // starts the next level
        let nextLevel = new BlueLevel();  // next level to be loaded
        engine.core.startScene(nextLevel);
    };

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
            );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
                // sets the background to gray

        // Step B: Create the support object in red
        this.mSupport = new engine.Renderable(engine.defaultResources.getConstColorShader());
        this.mSupport.setColor([0.8, 0.2, 0.2, 1]);
        this.mSupport.getXform().setPosition(20, 60);
        this.mSupport.getXform().setSize(5, 5);

        // Setp C: Create the hero object in blue
        this.mHero = new engine.Renderable(engine.defaultResources.getConstColorShader());
        this.mHero.setColor([0, 0, 1, 1]);
        this.mHero.getXform().setPosition(20, 60);
        this.mHero.getXform().setSize(2, 3);

        // now start the bg music ...
        engine.audio.playBackground(this.kBgClip);
    };

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setupViewProjection();

        // Step  C: draw everything
        this.mSupport.draw(this.mCamera.getVPMatrix());
        this.mHero.draw(this.mCamera.getVPMatrix());
    };

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // let's only allow the movement of hero, 
        // and if hero moves too far off, this level ends, we will
        // load the next level
        let deltaX = 0.05;
        let xform = this.mHero.getXform();

        // Support hero movements
        if (engine.input.isKeyPressed(engine.input.kKeys.Right)) {
            engine.audio.playACue(this.kCue);
            xform.incXPosBy(deltaX);
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(12, 60);
            }
        }

        if (engine.input.isKeyPressed(engine.input.kKeys.Left)) {
            engine.audio.playACue(this.kCue);
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 11) {  // this is the left-bound of the window
                engine.loop.stopLoop();
            }
        }
    };
}

export default MyGame;

window.onload = function() {
    let myGame = new MyGame();
    engine.core.initEngine('GLCanvas', myGame);
};