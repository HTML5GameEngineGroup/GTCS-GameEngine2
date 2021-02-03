/*
 * Encapsulate the Shader and VertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */

import * as gl from './internal/gl.js';
import Transform from './transform.js';
// import Camera from './camera.js';

class Renderable {
    constructor(shader) {
        this.mShader = shader;         // the shader for shading this object
        this.mXform = new Transform(); // transform that moves this object around
        this.mColor = [1, 1, 1, 1];    // color of pixel
    };

    draw(camera) {
        this.mShader.activateShader(this.mColor, camera.getCameraMatrix());  // always activate the shader first!
        this.mShader.loadModelMatrix(this.mXform.getTRSMatrix());
        gl.get().drawArrays(gl.get().TRIANGLE_STRIP, 0, 4);
    };

    getXform() { return this.mXform; };
    setColor(color) { this.mColor = color; };
    getColor() { return this.mColor; };
};

export default Renderable;