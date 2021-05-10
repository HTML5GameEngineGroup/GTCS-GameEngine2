/*
 * File: shadow_receiver.js
 * Shadow support
 * 
 * Instance variables:
 *     mReceiver: Reference to any GameObject
 *                Treats this target for shadow receiver
 *     mCasters: Reference to an array of Renderables that are at least LightRenderable
 *     
 * Draws the mReceiver, and the shadows of mCasters on this mReceiver
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as shaderResources from "../core/shader_resources.js";
import ShadowCaster from "./shadow_caster.js";
import * as glSys from "../core/gl.js";

class ShadowReceiver {
    constructor(theReceiverObject) {
        this.kShadowStencilBit = 0x01;              // The stencil bit to switch on/off for shadow
        this.kShadowStencilMask = 0xFF;             // The stencil mask 
        this.mReceiverShader = shaderResources.getShadowReceiverShader();

        this.mReceiver = theReceiverObject;

        // To support shadow drawing
        this.mShadowCaster = [];                    // array of ShadowCasters
    }

    addShadowCaster(lgtRenderable) {
        let c = new ShadowCaster(lgtRenderable, this.mReceiver);
        this.mShadowCaster.push(c);
    }
    // for now, cannot remove shadow casters


    draw(aCamera) {
        let c;

        // draw receiver as a regular renderable
        this.mReceiver.draw(aCamera);

        this._shadowRecieverStencilOn();
        let s = this.mReceiver.getRenderable().swapShader(this.mReceiverShader);
        this.mReceiver.draw(aCamera);
        this.mReceiver.getRenderable().swapShader(s);
        this._shadowRecieverStencilOff();

        // now draw shadow color to the pixels in the stencil that are switched on
        for (c = 0; c < this.mShadowCaster.length; c++) {
            this.mShadowCaster[c].draw(aCamera);
        }

        // switch off stencil checking
        this._shadowRecieverStencilDisable();
    }

    update() {
        this.mReceiver.update();
    }
    
    // #region Stencil operations
    /* 
     * GL Stencil settings to support rendering to and checking of 
     * the stencil buffer
     */
    _shadowRecieverStencilOn() {
        let gl = glSys.get();
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.enable(gl.STENCIL_TEST);
        gl.colorMask(false, false, false, false);
        gl.depthMask(false);
        gl.stencilFunc(gl.NEVER, this.kShadowStencilBit, this.kShadowStencilMask);
        gl.stencilOp(gl.REPLACE, gl.KEEP, gl.KEEP);
        gl.stencilMask(this.kShadowStencilMask);
    }

    _shadowRecieverStencilOff() {
        let gl = glSys.get();
        gl.depthMask(gl.TRUE);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilFunc(gl.EQUAL, this.kShadowStencilBit, this.kShadowStencilMask);
        gl.colorMask(true, true, true, true);
    }

    _shadowRecieverStencilDisable() {
        let gl = glSys.get();
        gl.disable(gl.STENCIL_TEST);
    }
    // #endregion 
}

export default ShadowReceiver;
