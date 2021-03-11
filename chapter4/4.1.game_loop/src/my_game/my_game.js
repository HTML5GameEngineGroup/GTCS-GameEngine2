/*
 * This is the logic of our game. 
 */

// Accessing engine internal is not ideal, 
//      this must be resolved! (later)
import * as loop from '../engine/core/internal/loop.js'

// Engine stuff
import engine from '../engine/index.js'

class MyGame  {
    constructor() {
        // variables for the squares
        this.mWhiteSq = null;        // these are the Renderable objects
        this.mRedSq = null;

        // The camera to view the scene
        this.mCamera = null;
    }

    init() {    
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        // Step  C: Create the Renderable objects:
        let constColorShader = new engine.SimpleShader(
                    "src/glsl_shaders/simple_vs.glsl",      // Path to the VertexShader 
                    "src/glsl_shaders/simple_fs.glsl");    // Path to the Simple FragmentShader    
        this.mWhiteSq = new engine.Renderable(constColorShader);
        this.mWhiteSq.setColor([1, 1, 1, 1]);
        this.mRedSq = new engine.Renderable(constColorShader);
        this.mRedSq.setColor([1, 0, 0, 1]);

        // Step  D: Initialize the white Renderable object: centered, 5x5, rotated
        this.mWhiteSq.getXform().setPosition(20, 60);
        this.mWhiteSq.getXform().setRotationInRad(0.2); // In Radians
        this.mWhiteSq.getXform().setSize(5, 5);

        // Step  E: Initialize the red Renderable object: centered 2x2
        this.mRedSq.getXform().setPosition(20, 60);
        this.mRedSq.getXform().setSize(2, 2);
    }


    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setViewAndCameraMatrix();

        // Step  C: Activate the white shader to draw
        this.mWhiteSq.draw(this.mCamera);

        // Step  D: Activate the red shader to draw
        this.mRedSq.draw(this.mCamera);
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // For this very simple game, let's move the white square and pulse the red
        let whiteXform = this.mWhiteSq.getXform();
        let deltaX = 0.05;

        if (whiteXform.getXPos() > 30) // this is the right-bound of the window
            whiteXform.setPosition(10, 60);
        whiteXform.incXPosBy(deltaX);
        whiteXform.incRotationByDegree(1);

        // Step B: pulse the red square
        let redXform = this.mRedSq.getXform();
        if (redXform.getWidth() > 5)
            redXform.setSize(2, 2);
        redXform.incSizeBy(0.05);
    }
}
export default MyGame;

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();    
    
    // new begins the game 
    loop.start(myGame);
}