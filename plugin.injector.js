const { root } = require('./config');
const _fs = require('fs');
const _path = require('path');
const _vm = require('vm');

const loadPluginsJS = (root) => {
    const content = _fs.readFileSync(_path.join(root, 'js', 'plugins.js'), 'utf8');

    const context = {};

    _vm.runInNewContext(content, context);

    return context.$plugins;
}

const injectPlugins = (plugins) => {
    const path = _path.join(__dirname, 'plugins');
    const files = _fs.readdirSync(path, {
        withFileTypes: true
    });
    for (const file of files) {
        if (file.isDirectory()) {
            const info = require(_path.join(path, file.name, 'info.json'));
            if (_fs.existsSync(_path.join(path, file.name, 'setup.js')))
                require(_path.join(path, file.name, 'setup.js'));
            _fs.copyFileSync(_path.join(path, file.name, 'index.js'), _path.join(root, 'js', 'plugins', info.name + '.js'));
            if (!plugins.find(x => x.name === info.name)) {
                plugins.push(info);
            } else {
                console.warn(`Plugin ${info.name} already exists. Skipping.`);
            }
        }
    }
}

const patchPluginsJS = (root, plugins) => {
    const content = `// Generated by RPG Maker.
// Do not edit this file directly.
var $plugins = ${JSON.stringify(plugins, null, 4)};`;

    _fs.writeFileSync(_path.join(root, 'js', 'plugins.js'), content, 'utf8');
}

const plugins = loadPluginsJS(root);
injectPlugins(plugins);
patchPluginsJS(root, plugins);

console.log('Plugins injected.');