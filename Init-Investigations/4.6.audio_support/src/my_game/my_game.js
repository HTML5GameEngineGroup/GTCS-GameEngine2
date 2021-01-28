/*
 * This is the logic of our game. 
 */


// Engine stuff
import engine from '../engine/index.js'

// User stuff
import BlueLevel from './blue_level.js'

class MyGame extends engine.Scene {

    constructor() {
        super();

        // audio clips: supports both mp3 and wav formats
        this.bgAudio = "assets/sounds/bg_clip.mp3";
        this.cue = "assets/sounds/my_game_cue.wav";

        // The camera to view the scene
        this.camera = null;

        // the hero and the support objects
        this.hero = null;
        this.support = null;
    }

    async setup() {
        // loads the audios
        await Promise.all([engine.resources.audio.load(this.bgAudio), engine.resources.audio.load(this.cue)])

        // Step A: set up the cameras
        this.camera = new engine.Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
        );
        this.camera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

        this.camera.setup();
        // sets the background to gray

        // Step B: Create the support object in red
        this.support = new engine.Renderable(engine.core.getConstColorShader());
        this.support.setColor([0.8, 0.2, 0.2, 1]);
        this.support.getXform().setPosition(20, 60);
        this.support.getXform().setSize(5, 5);

        // Setp C: Create the hero object in blue
        this.hero = new engine.Renderable(engine.core.getConstColorShader());
        this.hero.setColor([0, 0, 1, 1]);
        this.hero.getXform().setPosition(20, 60);
        this.hero.getXform().setSize(2, 3);

        // now start the bg music ...
        engine.resources.audio.playBG(this.bgAudio);
    };


    takedown() {
        // Step A: Game loop not running, unload all assets
        // stop the background audio
        engine.resources.audio.stopBG();

        // unload the scene resources
        // gEngine.AudioClips.unloadAudio(this.bgAudio);
        //      You know this clip will be used elsewhere in the game
        //      So you decide to not unload this clip!!
        engine.resources.audio.unload(this.cue);

        // Step B: starts the next level
        // starts the next level
        let nextLevel = new BlueLevel();  // next level to be loaded
        nextLevel.start()
    };

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas

        this.camera.refresh();
        // Step  B: Activate the drawing Camera

        // Step  C: draw everything
        this.support.draw(this.camera.getVPMatrix());
        this.hero.draw(this.camera.getVPMatrix());
    };

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // let's only allow the movement of hero, 
        // and if hero moves too far off, this level ends, we will
        // load the next level
        let deltaX = 0.05;
        let xform = this.hero.getXform();

        // Support hero movements
        if (engine.core.input.isKeyPressed(engine.core.input.keys.Right)) {
            engine.resources.audio.playCue(this.cue);
            xform.incXPosBy(deltaX);
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(12, 60);
            }
        }

        if (engine.core.input.isKeyPressed(engine.core.input.keys.Left)) {
            engine.resources.audio.playCue(this.cue);
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 11) {  // this is the left-bound of the window
                this.stop();
            }
        }
    };
}

export default MyGame;

window.onload = async function () {
    await engine.core.init('GLCanvas');
    let myGame = new MyGame();
    myGame.start()
};