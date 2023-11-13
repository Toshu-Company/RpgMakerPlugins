const { existsSync } = require("fs");
const { join } = require("path");

module.exports.root = process.argv[2];

if (!module.exports.root) {
    console.error("No root path specified");
    process.exit(1);
}

if (existsSync(join(module.exports.root, "www"))) {
    module.exports.root = join(module.exports.root, "www");
}