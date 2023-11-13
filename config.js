const { existsSync } = require("fs");
const { join } = require("path");

module.exports.root = "C:\\Users\\rmagur1203\\Downloads\\Dead Leaves v1.07\\Dead Leaves - 복사본";

if (existsSync(join(module.exports.root, "www"))) {
    module.exports.root = join(module.exports.root, "www");
}