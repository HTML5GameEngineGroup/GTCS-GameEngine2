let gl = null;

function initGL(canvasID) {
    var canvas = document.getElementById(canvasID);

    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable mGL
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (gl === null) {
        document.write("<br><b>WebGL is not supported!</b>");
        return;
    }
}

export { gl, initGL }