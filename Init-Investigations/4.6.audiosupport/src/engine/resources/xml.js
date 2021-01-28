let map = new Map();

export function has(path) { return map.has(path) }

export function get(path) {
    if (!has(path)) {
        throw new Error("can't get text synchronously, not loaded")
    }
    return map.get(path);
};

export async function load(path) {
    if (has(path)) return;

    await fetch(path)
        .then(res => res.text())
        .then(text => {
            let parser = new DOMParser();
            return parser.parseFromString(text, "text/xml");
        })
        .then(data => map.set(path, data))
        .catch(err => { throw err });
}

export function unload(path) { map.delete(path)}