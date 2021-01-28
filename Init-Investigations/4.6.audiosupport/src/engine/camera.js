/* 
 * Encapsulates the user define WC and Viewport functionality
 */

import core from './core/index.js';

class Camera {
    // wcCenter: is a vec2
    // wcWidth: is the width of the user defined WC
    //      Height of the user defined WC is implicitly defined by the viewport aspect ratio
    //      Please refer to the following
    // viewportRect: an array of 4 elements
    //      [0] [1]: (x,y) position of lower left corner on the canvas (in pixel)
    //      [2]: width of viewport
    //      [3]: height of viewport
    //      
    //  wcHeight = wcWidth * viewport[3]/viewport[2]
    //
    constructor(wcCenter, wcWidth, viewportArray) {
        // WC and viewport position and size
        this.wCCenter = wcCenter;
        this.wCWidth = wcWidth;
        this.viewport = viewportArray;  // [x, y, width, height]
        this.nearPlane = 0;
        this.farPlane = 1000;

        // transformation matrices
        this.viewMatrix = mat4.create();
        this.projMatrix = mat4.create();
        this.vPMatrix = mat4.create();

        // background color
        this.bgColor = [0.8, 0.8, 0.8, 1]; // RGB and Alpha
    };

    setWCCenter(xPos, yPos) {
        this.wCCenter[0] = xPos;
        this.wCCenter[1] = yPos;
    };
    getWCCenter() { return this.wCCenter; };
    setWCWidth(width) { this.wCWidth = width; };

    setViewport(viewportArray) { this.viewport = viewportArray; };
    getViewport() { return this.viewport; };


    setBackgroundColor(newColor) { this.bgColor = newColor; };
    getBackgroundColor() { return this.bgColor; };

    // Getter for the View-Projection transform operator
    getVPMatrix() {
        return this.vPMatrix;
    };


    // call before you start drawing with this camera
    setup() {
        // Step A1: Set up the viewport: area on canvas to be drawn
        core.gl.get().viewport(this.viewport[0],  // x position of bottom-left corner of the area to be drawn
            this.viewport[1],  // y position of bottom-left corner of the area to be drawn
            this.viewport[2],  // width of the area to be drawn
            this.viewport[3]); // height of the area to be drawn
        // Step A2: set up the corresponding scissor area to limit the clear area
        core.gl.get().scissor(this.viewport[0], // x position of bottom-left corner of the area to be drawn
            this.viewport[1], // y position of bottom-left corner of the area to be drawn
            this.viewport[2], // width of the area to be drawn
            this.viewport[3]);// height of the area to be drawn

        // Step B1: define the view matrix
        mat4.lookAt(this.viewMatrix,
            [this.wCCenter[0], this.wCCenter[1], 10],   // WC center
            [this.wCCenter[0], this.wCCenter[1], 0],    // 
            [0, 1, 0]);     // orientation

        // Step B2: define the projection matrix
        var halfWCWidth = 0.5 * this.wCWidth;
        var halfWCHeight = halfWCWidth * this.viewport[3] / this.viewport[2]; // viewportH/viewportW
        mat4.ortho(this.projMatrix,
            -halfWCWidth,   // distance to left of WC
            halfWCWidth,   // distance to right of WC
            -halfWCHeight,  // distance to bottom of WC
            halfWCHeight,  // distance to top of WC
            this.nearPlane,   // z-distance to near plane 
            this.farPlane  // z-distance to far plane 
        );
        // Step B3: concatenate view and project matrices
        mat4.multiply(this.vPMatrix, this.projMatrix, this.viewMatrix);
    };

    // call everytime you're going to draw something new
    refresh() {
        // Step A3: set the color to be clear
        core.gl.get().clearColor(this.bgColor[0], this.bgColor[1], this.bgColor[2], this.bgColor[3]);  // set the color to be cleared
        // Step A4: enable the scissor area, clear, and then disable the scissor area
        core.gl.get().enable(core.gl.get().SCISSOR_TEST);
        core.gl.get().clear(core.gl.get().COLOR_BUFFER_BIT);
        core.gl.get().disable(core.gl.get().SCISSOR_TEST);
    }
};

export default Camera;