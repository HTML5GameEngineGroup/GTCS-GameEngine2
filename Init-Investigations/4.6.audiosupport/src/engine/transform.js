/* 
 * Encapsulates the matrix transformation functionality, meant to work with
 * Renderable
 */

class Transform {
    
    constructor() {
        this.position = vec2.fromValues(0, 0);  // this is the translation
        this.scale = vec2.fromValues(1, 1);     // this is the width (x) and height (y)
        this.rotationInRad = 0.0;               // in radians!
    }

    setPosition(xPos, yPos) { this.setXPos(xPos); this.setYPos(yPos); };
    getPosition() { return this.position; };
    getXPos() { return this.position[0]; };
    setXPos(xPos) { this.position[0] = xPos; };
    incXPosBy(delta) { this.position[0] += delta; };
    getYPos() { return this.position[1]; };
    setYPos(yPos) { this.position[1] = yPos; };
    incYPosBy(delta) { this.position[1] += delta; };
    
    setSize(width, height) {
        this.setWidth(width);
        this.setHeight(height);
    };
    getSize() { return this.scale; };
    incSizeBy(delta) {
        this.incWidthBy(delta);
        this.incHeightBy(delta);
    };
    getWidth() { return this.scale[0]; };
    setWidth(width) { this.scale[0] = width; };
    incWidthBy(delta) { this.scale[0] += delta; };
    getHeight() { return this.scale[1]; };
    setHeight(height) { this.scale[1] = height; };
    incHeightBy(delta) { this.scale[1] += delta; };
    setRotationInRad(rotationInRadians) {
        this.rotationInRad = rotationInRadians;
        while (this.rotationInRad > (2 * Math.PI)) {
            this.rotationInRad -= (2 * Math.PI);
        }
    };
    setRotationInDegree(rotationInDegree) {
        this.setRotationInRad(rotationInDegree * Math.PI / 180.0);
    };
    incRotationByDegree(deltaDegree) {
        this.incRotationByRad(deltaDegree * Math.PI / 180.0);
    };
    incRotationByRad(deltaRad) {
        this.setRotationInRad(this.rotationInRad + deltaRad);
    };
    getRotationInRad() {  return this.rotationInRad; };
    getRotationInDegree() { return this.rotationInRad * 180.0 / Math.PI; };
    
    // returns the matrix the concatenates the transformations defined
    getTRS() {
        // Creates a blank identity matrix
        var matrix = mat4.create();

        // The matrices that WebGL uses are transposed, thus the typical matrix
        // operations must be in reverse.

        // Step A: compute translation, for now z is always at 0.0
        mat4.translate(matrix, matrix, vec3.fromValues(this.getXPos(), this.getYPos(), 0.0));
        // Step B: concatenate with rotation.
        mat4.rotateZ(matrix, matrix, this.getRotationInRad());
        // Step C: concatenate with scaling
        mat4.scale(matrix, matrix, vec3.fromValues(this.getWidth(), this.getHeight(), 1.0));

        return matrix;
    };
}

export default Transform;