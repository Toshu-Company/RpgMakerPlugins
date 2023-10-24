window.requireMap = {};

window.require = (path) => {
    if (window.requireMap[path]) {
        return window.requireMap[path];
    }
    throw new Error(`Cannot find module '${path}'`);
};

DataManager.relativePath = (path) => path;

window.requireMap["path"] = {
    join: (...args) => args.join("/"),
    dirname: (path) => path.split("/").slice(0, -1).join("/"),
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
        const key = ["readdir", ...path.split(/\\|\//).filter(x => x)].join("_");
        callback(eval(key).files);
    },
    readdirSync: (path, options) => {
        const key = ["readdir", ...path.split(/\\|\//).filter(x => x)].join("_");
        return eval(key).files;
    },
    readFileSync: async (path, encoding) => {
        return await readfile(path);
    },
};
window.requireMap["lodash/cloneDeep"] = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};