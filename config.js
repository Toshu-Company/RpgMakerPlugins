const { existsSync } = require("fs");
const { join } = require("path");

module.exports.root = "E:\\Games\\temp\\ミューテーション！(体験版)";

if (existsSync(join(module.exports.root, "www"))) {
    module.exports.root = join(module.exports.root, "www");
}