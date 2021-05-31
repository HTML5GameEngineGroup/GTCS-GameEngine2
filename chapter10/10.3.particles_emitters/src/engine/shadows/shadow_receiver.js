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

        glSys.beginDrawToStencil(this.kShadowStencilBit, this.kShadowStencilMask);
        let s = this.mReceiver.getRenderable().swapShader(this.mReceiverShader);
        this.mReceiver.draw(aCamera);
        this.mReceiver.getRenderable().swapShader(s);
        glSys.endDrawToStencil(this.kShadowStencilBit, this.kShadowStencilMask);

        // now draw shadow color to the pixels in the stencil that are switched on
        for (c = 0; c < this.mShadowCaster.length; c++) {
            this.mShadowCaster[c].draw(aCamera);
        }

        // switch off stencil checking
        glSys.disableDrawToStencil();
    }
}

export default ShadowReceiver;
