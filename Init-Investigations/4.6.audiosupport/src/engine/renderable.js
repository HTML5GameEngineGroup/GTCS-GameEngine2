/*
 * Encapsulate the Shader and VertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */

import core from './core/index.js';
import Transform from './transform.js'

class Renderable {
    constructor(shader) {
        this.shader = shader;         // the shader for shading this object
        this.xform = new Transform(); // transform that moves this object around
        this.color = [1, 1, 1, 1];    // color of pixel
    };

    draw(vpMatrix) {
        this.shader.activateShader(this.color, vpMatrix);  // always activate the shader first!
        this.shader.loadObjectTransform(this.xform.getTRS());
        core.gl.get().drawArrays(core.gl.get().TRIANGLE_STRIP, 0, 4);
    };

    getXform() { return this.xform; };
    setColor(color) { this.color = color; };
    getColor() { return this.color; };
};

export default Renderable;