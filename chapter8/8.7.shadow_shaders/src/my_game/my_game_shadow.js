/*
 * File: my_game_shadow.js 
 * 
 * Sets up shadow configuration for MyGame class
 */

"use strict";  // Operate in Strict mode such that letiables must be declared before used!

import engine from "../engine/index.js";
import MyGame from "./my_game_material_control.js";

MyGame.prototype._setupShadow = function () {
    this.mBgShadow = new engine.ShadowReceiver(this.mBg);
    this.mBgShadow.addShadowCaster(this.mLgtHero);
    this.mBgShadow.addShadowCaster(this.mIllumMinion);
    this.mBgShadow.addShadowCaster(this.mLgtMinion);

    this.mMinionShadow = new engine.ShadowReceiver(this.mIllumMinion);
    this.mMinionShadow.addShadowCaster(this.mIllumHero);
    this.mMinionShadow.addShadowCaster(this.mLgtHero);
    this.mMinionShadow.addShadowCaster(this.mLgtMinion);

    this.mLgtMinionShaodw = new engine.ShadowReceiver(this.mLgtMinion);
    this.mLgtMinionShaodw.addShadowCaster(this.mIllumHero);
    this.mLgtMinionShaodw.addShadowCaster(this.mLgtHero);
}

export default MyGame;