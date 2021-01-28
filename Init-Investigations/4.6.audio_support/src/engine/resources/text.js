let mMap = new Map();

function has(path) { return mMap.has(path) }

function get(path) {
    if (!has(path)) {
        throw new Error("can't get text synchronously, not loaded")
    }
    return mMap.get(path);
};

async function load(path) {
    if (has(path)) return;

    await fetch(path)
        .then(res => res.text())
        .then(data => mMap.set(path, data))
        .catch(err => { throw err });
}

function unload(path) { mMap.delete(path) }

export {has, get, load, unload}