const { existsSync } = require("fs");
const { join } = require("path");

module.exports.root = "E:\\Games\\temp\\RJ01040712) INNOCENT RULES v1.10 이미지번역 (재압축)\\INNOCENT RULES ver1.10";

if (existsSync(join(module.exports.root, "www"))) {
    module.exports.root = join(module.exports.root, "www");
}