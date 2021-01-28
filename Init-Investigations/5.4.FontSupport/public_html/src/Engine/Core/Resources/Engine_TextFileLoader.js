/*
 * File: EngineCore_TextFileLoader.js 
 * loads an text file into resourceMap, either as simple text or as XML
 */
/*jslint node: true, vars: true, evil: true */
/*global gEngine: false, XMLHttpRequest: false, DOMParser: false, alert: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as map from './Engine_ResourceMap.js'
    // all the map_ functions

let eTextFileType = Object.freeze({
        eXMLFile: 0,
        eTextFile: 1
    });

    // if fileType is a eTextFileType
let loadTextFile = function (fileName, fileType) {
    if (!(map.isAssetLoaded(fileName))) {
        // Update resources in load counter.
        map.asyncLoadRequested(fileName);

        // Asynchronously request the data from server.
        let req = new XMLHttpRequest();
        
        // status from loading
        req.onreadystatechange = function () {
            if ((req.readyState === 4) && (req.status !== 200)) {
                alert(fileName + ": loading failed! [Hint: you cannot double click index.html to run this project. " +
                        "The index.html file must be loaded by a web-server.]");
            }
        };
        req.open('GET', fileName, true);
        req.setRequestHeader('Content-Type', 'text/xml');

        // callback when load is completed
        req.onload = function () {
            let fileContent = null;
            if (fileType === eTextFileType.eXMLFile) {
                let parser = new DOMParser();
                fileContent = parser.parseFromString(req.responseText, "text/xml");
            } else {
                fileContent = req.responseText;
            }
            map.asyncLoadCompleted(fileName, fileContent);
        };
        req.send();
    } else {
        // resource already loaded, increment reference count
        map.incAssetRefCount(fileName);
    }
};

let unloadTextFile = function (fileName) {
    map.unloadAsset(fileName);
};

    // Public interface for this object. Anything not in here will
    // not be accessable.
export {
        loadTextFile as load,
        unloadTextFile as unload,
        eTextFileType
};