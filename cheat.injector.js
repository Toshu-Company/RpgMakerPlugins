const { root } = require('./config');
const { readFileSync, copyFileSync, cpSync, existsSync } = require("fs");
const { join } = require("path");
const vm = require("vm");

const inject = async () => {
    if (existsSync(join(root, "js", "rpg_core.js"))) {
        // const content = readFileSync(join(root, "js", "rpg_core.js"), "utf8");

        // const line = content.substring(content.indexOf("Utils.RPGMAKER_NAME"), content.indexOf("Utils.RPGMAKER_NAME") + 100).split("\n")[0].trim();

        // const context = {
        //     Utils: {}
        // };

        // vm.runInNewContext(line, context);

        // const { Utils } = context;

        // if (Utils.RPGMAKER_NAME == "MV") {
        //     copyFileSync("cheat-engine/www/_cheat_initialize/mv/js/main.js", join(root, "js", "main.js"));
        // }
        // else if (Utils.RPGMAKER_NAME == "MZ") {
        //     copyFileSync("cheat-engine/www/_cheat_initialize/mz/js/main.js", join(root, "js", "main.js"));
        // }
        // else {
        //     throw new Error("Unknown RPG Maker version.");
        // }
        copyFileSync("cheat-engine/www/_cheat_initialize/mv/js/main.js", join(root, "js", "main.js"));
    } else if (existsSync(join(root, "js", "rmmz_core.js"))) {
        copyFileSync("cheat-engine/www/_cheat_initialize/mz/js/main.js", join(root, "js", "main.js"));
    } else {
        throw new Error("Unknown RPG Maker version.");
    }
    cpSync("cheat-engine/www/cheat", join(root, "cheat"), {
        recursive: true
    });
}

inject();