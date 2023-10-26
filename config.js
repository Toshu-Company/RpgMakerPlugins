const { existsSync } = require("fs");
const { join } = require("path");

module.exports.root = "E:\\Games\\temp\\엿보기 도촬 학원";

if (existsSync(join(module.exports.root, "www"))) {
    module.exports.root = join(module.exports.root, "www");
}