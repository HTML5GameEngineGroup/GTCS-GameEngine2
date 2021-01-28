/*
 * This is the logic of our game. 
 */


// Engine Core stuff
import engine from '../engine/index.js'

// Local stuff
import MyGame from './my_game.js'
import SceneFileParser from './util/scene_file_parser.js'

class BlueLevel extends engine.Scene {
    constructor() {
        super();

        // audio clips: supports both mp3 and wav formats
        this.bgAudio = "assets/sounds/bg_clip.mp3";
        this.cue = "assets/sounds/blue_level_cue.wav";

        // scene file name
        this.sceneFile = "assets/blue_level.xml";
        // all squares
        this.sqSet = [];        // these are the Renderable objects

        // The camera to view the scene
        this.camera = null;
    }


    async setup() {
        await Promise.all(
            [engine.resources.xml.load(this.sceneFile),
            engine.resources.audio.load(this.bgAudio),
            engine.resources.audio.load(this.cue)
            ])

        let sceneParser = new SceneFileParser(engine.resources.xml.get(this.sceneFile));

        // Step A: Read in the camera
        this.camera = sceneParser.parseCamera();
        this.camera.setup();

        // Step B: Read all the squares
        sceneParser.parseSquares(this.sqSet);

        // now start the bg music ...
        engine.resources.audio.playBG(this.bgAudio);

    };

    takedown() {
        // stop the background audio
        engine.resources.audio.stopBG();

        // unload the scene flie and loaded resources
        engine.resources.xml.unload(this.sceneFile);
        engine.resources.audio.unload(this.bgAudio);
        engine.resources.audio.unload(this.cue);

        let nextLevel = new MyGame();  // load the next level
        nextLevel.start();
    };

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        this.camera.refresh();
        // Step  C: draw all the squares
        let i;
        for (i = 0; i < this.sqSet.length; i++) {
            this.sqSet[i].draw(this.camera.getVPMatrix());
        }
    };

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // For this very simple game, let's move the first square
        let xform = this.sqSet[1].getXform();
        let deltaX = 0.05;

        /// Move right and swap ovre
        if (engine.core.input.isKeyPressed(engine.core.input.keys.Right)) {
            engine.resources.audio.playCue(this.cue);
            xform.incXPosBy(deltaX);
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(12, 60);
            }
        }

        // Step A: test for white square movement
        if (engine.core.input.isKeyPressed(engine.core.input.keys.Left)) {
            engine.resources.audio.playCue(this.cue);
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 11) { // this is the left-boundary
                this.stop();
            }
        }
    };
}

export default BlueLevel;