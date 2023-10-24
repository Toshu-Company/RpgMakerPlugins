const { existsSync } = require("fs");
const { join } = require("path");

module.exports.root = "E:\\Games\\temp\\RJ328928\\ヤレるチケットv1.01";

if (existsSync(join(module.exports.root, "www"))) {
    module.exports.root = join(module.exports.root, "www");
}