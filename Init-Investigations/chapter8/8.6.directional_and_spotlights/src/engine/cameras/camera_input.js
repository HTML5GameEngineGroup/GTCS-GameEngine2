/*
 * File: camera_input.js
 *
 * Adds functions that support mouse input (transform from DC to WC)
 */
"use strict"

import Camera from "./camera_manipulation.js";
import { eViewport } from "./camera_main.js";
import * as input from "../input.js";

Camera.prototype.mouseDCX = function () {
    return input.getMousePosX() - this.mViewport[eViewport.eOrgX];
}

Camera.prototype.mouseDCY = function() {
    return input.getMousePosY() - this.mViewport[eViewport.eOrgY];
}

Camera.prototype.isMouseInViewport = function () {
    let dcX = this.mouseDCX();
    let dcY = this.mouseDCY();
    return ((dcX >= 0) && (dcX < this.mViewport[eViewport.eWidth]) &&
        (dcY >= 0) && (dcY < this.mViewport[eViewport.eHeight]));
}

Camera.prototype.mouseWCX = function () {
    let minWCX = this.getWCCenter()[0] - this.getWCWidth() / 2;
    return minWCX + (this.mouseDCX() * (this.getWCWidth() / this.mViewport[eViewport.eWidth]));
}

Camera.prototype.mouseWCY = function () {
    let minWCY = this.getWCCenter()[1] - this.getWCHeight() / 2;
    return minWCY + (this.mouseDCY() * (this.getWCHeight() / this.mViewport[eViewport.eHeight]));
}

export default Camera;