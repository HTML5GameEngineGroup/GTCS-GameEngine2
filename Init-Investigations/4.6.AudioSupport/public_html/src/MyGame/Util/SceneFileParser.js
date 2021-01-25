/*
 * File: SceneFile_Parse.js 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, console: false, Camera: false, vec2: false, Renderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as map from '../../Engine/Core/Resources/Engine_ResourceMap.js'
import * as defaultResources from '../../Engine/Core/Resources/Engine_DefaultResources.js'

// Engine utility stuff
import Camera from '../../Engine/Camera.js'
import Scene from '../../Engine/Scene.js'
import Transform from '../../Engine/Transform.js'
import SimpleShader from '../../Engine/SimpleShader.js'
import Renderable from '../../Engine/Renderable.js'

class SceneFileParser {
    
    constructor (sceneFilePath) {
        this.mSceneXml = map.retrieveAsset(sceneFilePath);
    }

    parseCamera() {
        let camElm = getElm(this.mSceneXml, "Camera");
        let cx = Number(camElm[0].getAttribute("CenterX"));
        let cy = Number(camElm[0].getAttribute("CenterY"));
        let w = Number(camElm[0].getAttribute("Width"));
        let viewport = camElm[0].getAttribute("Viewport").split(" ");
        let bgColor = camElm[0].getAttribute("BgColor").split(" ");
        // make sure viewport and color are number
        let j;
        for (j = 0; j < 4; j++) {
            bgColor[j] = Number(bgColor[j]);
            viewport[j] = Number(viewport[j]);
        }

        let cam = new Camera(
            vec2.fromValues(cx, cy),  // position of the camera
            w,                        // width of camera
            viewport                  // viewport (orgX, orgY, width, height)
            );
        cam.setBackgroundColor(bgColor);
        return cam;
    };

    parseSquares(sqSet) {
        let elm = getElm(this.mSceneXml, "Square");
        let i, j, x, y, w, h, r, c, sq;
        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
            y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
            w = Number(elm.item(i).attributes.getNamedItem("Width").value);
            h = Number(elm.item(i).attributes.getNamedItem("Height").value);
            r = Number(elm.item(i).attributes.getNamedItem("Rotation").value);
            c = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
            sq = new Renderable(defaultResources.getConstColorShader());
            // make sure color array contains numbers
            for (j = 0; j < 4; j++) {
                c[j] = Number(c[j]);
            }
            sq.setColor(c);
            sq.getXform().setPosition(x, y);
            sq.getXform().setRotationInDegree(r); // In Degree
            sq.getXform().setSize(w, h);
            sqSet.push(sq);
        }
    };
}

function getElm(xmlContent, tagElm) {
    let theElm = xmlContent.getElementsByTagName(tagElm);
    if (theElm.length === 0) {
        console.error("Warning: Level element:[" + tagElm + "]: is not found!");
    }
    return theElm;
};


export default SceneFileParser;
