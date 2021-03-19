import { gl } from "../gl/index.js";
import Shaders from "../shaders/index.js";

let  verticesOfSquare = [
    1, 1, 0,
    -1, 1, 0,
    1, -1, 0,
    -1, -1, 0
];

let verticesOfTriangle = [
    0, 1, 0,
    -1, -1, 0,
    1, -1, 0,
]

let verticesOfCircle = []
let vertices = 100;
let delta = (2.0 * Math.PI) / (vertices-1);
for (let i = 0; i < 100; i++) {
    let angle = i * delta;
    verticesOfCircle.push(Math.cos(angle), Math.sin(angle), 1);
}

let shaders = null;
let squareVertexBuffer = null
let triangleVertexBuffer = null
let circleVertexBuffer = null

function initEngine(vertexShaderPath, fragmentShaderPath) {
    shaders = new Shaders(vertexShaderPath, fragmentShaderPath);

    squareVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.STATIC_DRAW);

    triangleVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfTriangle), gl.STATIC_DRAW);

    circleVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfCircle), gl.STATIC_DRAW);
        
}

function drawRect(scaleX, scaleY, offsetX, offsetY, color) {
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
    shaders.activate(color, scaleX, scaleY, offsetX, offsetY);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function drawTriangle(scaleX, scaleY, offsetX, offsetY, color) {
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    shaders.activate(color, scaleX, scaleY, offsetX, offsetY);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
}

function drawOval(scaleX, scaleY, offsetX, offsetY, color) {
    gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexBuffer);
    shaders.activate(color, scaleX, scaleY, offsetX, offsetY);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, verticesOfCircle.length);
}

export { initEngine, drawRect, drawTriangle, drawOval }