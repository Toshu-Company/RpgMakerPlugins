const { readdirSync, writeFileSync } = require('fs');
const { root } = require('../../config');
const { join } = require('path');

const content = {
    readdir: {}
};

function search(path) {
    // const result = readdirSync(path, {
    //     withFileTypes: true
    // }).map(file => {
    //     if (file.isDirectory()) {
    //         return {
    //             [file.name]: search(join(path, file.name))
    //         };
    //     }
    //     return file.name;
    // });
    return readdirSync(path, {
        withFileTypes: true
    }).reduce((acc, file) => {
        if (file.isDirectory()) {
            acc[file.name] = search(join(path, file.name));
        }
        acc.files = acc.files || [];
        acc.files.push(file.name);
        return acc;
    }, {});
}

content.readdir = search(root);

function variablify(obj, name) {
    let result = '';
    if (typeof obj === 'object') {
        result += `const ${name} = ${JSON.stringify(obj, null, 4)};\n`;
        for (const key in obj) {
            result += variablify(obj[key], name + '_' + key);
        }
    }
    return result;
}

writeFileSync(join(root, 'js', 'fs.js'), variablify(content.readdir, "readdir"), 'utf8');