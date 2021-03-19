import { initEngine, drawRect, drawTriangle, drawOval } from "./engine/index.js";
import { gl, initGL } from "./gl/index.js";

window.onload = function () {
    initGL('glCanvas');
    initEngine('./resources/VS.glsl', './resources/FS.glsl');

    gl.clearColor(0, 0.8, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // variation along x axis
    let posXs = [-.8,-.5, -.2,.1,.6]
    let colors = [[1,0,0,1],[0,1,0,1],[0,0,1,1],[1,1,0,1],[0,1,1,1]];
    let scaleXs = [.05,.1,.08,.15,.25]
    let scaleYs = [.2,.05,.1,.15,.3]

    // variation along y axis
    let posYs = [0.65, 0, -0.65]
    let functions = [drawRect, drawTriangle, drawOval]
    

    for (let x = 0; x < 5; x++) {
        let posX = posXs[x];
        let color = colors[x];
        let scaleX = scaleXs[x];
        let scaleY = scaleYs[x];
        for (let y = 0; y < 3; y++) {
            let posY = posYs[y];
            let f = functions[y];
            f(scaleX, scaleY, posX, posY, color);
        }
    }
}