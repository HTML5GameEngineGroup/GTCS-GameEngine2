/*
 * File: my_game.js 
 * This is the logic of our game. 
 */

"use strict";  // Operate in Strict mode such that letiables must be declared before used!

import engine from "../engine/index.js";
import MyGame from "./my_game_shadow.js";

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}