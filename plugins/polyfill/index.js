(() => {
    if (window.require) {
        return;
    }

    const pathname = new URL(location.href).host !== 'games.toshu.me' ? "" : location.pathname.match(/\/[^\/]*\//)[0].replace(/^\//, '').replace(/\/$/, '').replace(/\/[^\/]*\.[^\/]*$/, '');

    function resolve(path) {
        return path.split(/\\|\//).filter(x => x && x !== pathname).join("/");
    }

    window.requireMap = {};

    window.require = (path) => {
        if (window.requireMap[path]) {
            return window.requireMap[path];
        }
        throw new Error(`Cannot find module '${path}'`);
    };

    DataManager.relativePath = (path) => path;

    Utils.isNwjs = () => false;

    window.requireMap["path"] = {
        join: (...args) => args.join("/"),
        split: (path) => path.split(/\\|\//),
        dirname: (path) => path.split("/").slice(0, -1).join("/"),
        extname: (path) => '.' + path.split(".").slice(1).join("."),
        basename: (path) => path.split("/").pop(),
        parse: (path) => {
            const parts = path.split("/");
            return {
                root: parts[0],
                dir: parts.slice(0, -1).join("/"),
                base: parts[parts.length - 1],
                ext: '.' + parts[parts.length - 1].split(".").slice(1).join("."),
                name: parts[parts.length - 1].split(".").slice(0, -1).join("."),
            };
        },
    };

    const readfile = (path) => new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', path);
        xhr.onload = function () {
            if (xhr.status < 400) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(xhr.statusText));
            }
        };
        xhr.onerror = function () {
            reject(new Error(xhr.statusText));
        };
        xhr.send();
    });
    window.requireMap["fs"] = {
        readdir: (path, callback) => {
            path = resolve(path);
            const key = ["readdir", ...path.split(/\\|\//).filter(x => x)].join("_");
            callback(eval(key).files);
        },
        readdirSync: (path, options) => {
            path = resolve(path);
            const key = ["readdir", ...path.split(/\\|\//).filter(x => x)].join("_");
            return eval(key).files;
        },
        statSync: (path) => {
            path = resolve(path);
            const key = ["readdir", ...path.split(/\\|\//).filter(x => x)].join("_");
            const key2 = ["readdir", ...path.split(/\\|\//).slice(0, -1).filter(x => x && x !== "www")].join("_");
            return {
                isDirectory: () => {
                    try {
                        return !!eval(key);
                    } catch (e) {
                        return false;
                    }
                },
                isFile: () => {
                    try {
                        return !eval(key);
                    } catch (e) {
                        return eval(key2).files.includes(path.split(/\\|\//).pop());
                    }
                },
            };
        },
        existsSync: (path) => {
            path = resolve(path);
            try {
                const key = ["readdir", ...path.split(/\\|\//).slice(0, -1).filter(x => x && x !== "www")].join("_");
                return eval(key).files.includes(path.split(/\\|\//).pop());
            } catch (e) {
                return null;
            }
        },
        readFileSync: async (path, encoding) => {
            return await readfile(path);
        },
    };
    window.requireMap["lodash/cloneDeep"] = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
    window.process = {
        mainModule: {
            filename: "/" + pathname + "/index.html",
        },
    }
})();