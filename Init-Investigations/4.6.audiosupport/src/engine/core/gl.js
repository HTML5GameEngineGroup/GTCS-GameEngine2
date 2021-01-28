let gl = null

export function get() { return gl; }

export function init(htmlCanvasID) {
    var canvas = document.getElementById(htmlCanvasID);

    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable mGL
    gl = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2");

    if (gl === null) {
        document.write("<br><b>WebGL 2 is not supported!</b>");
        return;
    }
}
