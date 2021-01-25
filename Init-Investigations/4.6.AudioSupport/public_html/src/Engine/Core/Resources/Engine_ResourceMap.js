/*
 * File: Engine_ResourceMap.js 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

class MapEntry {
    constructor() {
        this.mAsset = null;
        this.mRefCount = 1;
    }
    incRefCount() {
        this.mRefCount += 1;
        return this.mRefCount;
    }
    decRefCount() {
        this.mRefCount -= 1;
        return this.mRefCount;
    }
    retrieveAsset(rName) {
        return this.mAsset;
    }
    setAsset(asset) {
        this.mAsset = asset;
        return this.mAsset;
    }
};

// Number of outstanding load operations
var mNumOutstandingLoads = 0;

// Callback function when all textures are loaded
let mLoadCompleteCallback = null;

// Resource storage
let mResourceMap = {};

/*
 * Register one more resource to load
 */
function asyncLoadRequested(rName) {
    mResourceMap[rName] = new MapEntry(); // place holder for the resource to be loaded
    ++mNumOutstandingLoads;
};

function asyncLoadCompleted(rName, loadedAsset) {
    if (!isAssetLoaded(rName)) {
        alert("map_asyncLoadCompleted: [" + rName + "] not in map!");
    }
    mResourceMap[rName].setAsset(loadedAsset);
    --mNumOutstandingLoads;
    checkForAllLoadCompleted();
};

function checkForAllLoadCompleted() {
    if ((mNumOutstandingLoads === 0) && (mLoadCompleteCallback !== null)) {
        // ensures the load complete call back will only be called once!
        let funToCall = mLoadCompleteCallback;
        mLoadCompleteCallback = null;
        funToCall();
    }
};

// Make sure to set the callback _AFTER_ all load commands are issued
function setLoadCompleteCallback(funct) {
    mLoadCompleteCallback = funct;
    // in case all loading are done
    checkForAllLoadCompleted();
};

//<editor-fold desc="Asset checking functions">
function retrieveAsset(rName) {
    let r = null;
    if (rName in mResourceMap) {
        r = mResourceMap[rName].retrieveAsset();
    } else {
        alert("gEngine.retrieveAsset: [" + rName + "] not in map!");
    }
    return r;
};

function isAssetLoaded(rName) {
    return (rName in mResourceMap);
};

function incAssetRefCount(rName) {
    mResourceMap[rName].incRefCount();
};

function unloadAsset(rName) {
    let c = 0;
    if (rName in mResourceMap) {
        c = mResourceMap[rName].decRefCount();
        if (c === 0) {
            delete mResourceMap[rName];
        }
    }
    return c;
};

export {
        // async load registeration + callback
        asyncLoadRequested,
        asyncLoadCompleted,
        setLoadCompleteCallback,
        incAssetRefCount,
        retrieveAsset,
        unloadAsset,
        isAssetLoaded
    };