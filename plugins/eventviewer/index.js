const commandCode = {
    101: "Setup Show Text",
    102: "Show Choices",
    103: "Input Number",
    104: "Select Item",
    108: "Comment",
    111: "Conditional Branch",
    117: "Common Event",
    122: "Control Variables",
    123: "Control Self Switch",
    126: "Change Items",
    128: "Change Armor",
    129: "Change Party Member",
    201: "Transfer Player",
    250: "Play SE",
    355: "Eval Script(Entry)",
    401: "Text Parameter",
    402: "When [**]",
    403: "When Cancel",
    408: "Comment",
    655: "Eval Script"
}
const commandParameter = {
    111: ["Type", "ID", "Value/Key", "Else"],
    117: ["Common Event ID"],
    123: ["SwitchCh", "On(0)/Off(1)"],
    126: ["Item ID", "Pos(0)/Neg(1)", "Immediate(0)/Variable(1)", "Value/Key"],
    129: ["Actor ID", "Add(0)/Remove(1)"],
    201: [
        ["Direct", "X", "Y", "Direction", "Fade Type"],
        ["Variable", "*X", "*Y", "Direction", "Fade Type"],
    ],
    250: ["SE"],
}
/*
101: "Show Text",
    -> 401: "Text",
    -> 102: "Show Choices",
    -> 103: "Input Number",
    -> 104: "Select Item",
*/

class Information {
    constructor() {
        this.switchNames = $dataSystem.switches.slice();
    }

    switch(id) {
        return {
            id: id,
            name: this.switchNames[id],
            value: $gameSwitches.value(id),
        }
    }

    setSwitch(id, value) {
        $gameSwitches.setValue(id, value);
    }
}

class Debugger {
    changedSwitches = new Set();
    changedSelfSwitches = new Set();
    changedVariables = new Set();
    switchLogs = [];
    selfSwitchLogs = [];
    variableLogs = [];
    switchDiff = {};
    selfSwitchDiff = {};
    variableDiff = {};

    information = new Information();

    constructor() {
    }

    attach() {
        $gameSwitches.changed = this.changedSwitches;
        $gameSwitches.log = this.switchLogs;
        $gameSwitches.diff = this.switchDiff;
        $gameSwitches.setValue = function (switchId, value) {
            const oldValue = this.value(switchId);
            if (oldValue != value) {
                this._data[switchId] = value;
                this.onChange(switchId);
                this.changed.add(switchId);
                this.log.push({
                    id: switchId,
                    value: value,
                    oldValue: oldValue,
                });
                this.diff[switchId] = {
                    old: this.diff.old ?? oldValue,
                    new: value,
                }
            }
        }

        $gameSelfSwitches.changed = this.changedSelfSwitches;
        $gameSelfSwitches.log = this.selfSwitchLogs;
        $gameSelfSwitches.diff = this.selfSwitchDiff;
        $gameSelfSwitches.setValue = function (key, value) {
            const oldValue = this.value(key);
            if (oldValue != value) {
                this._data[key] = value;
                this.onChange(key);
                this.changed.add(key);
                this.log.push({
                    id: key,
                    value: value,
                    oldValue: oldValue,
                });
                this.diff[key] = {
                    old: this.diff.old ?? oldValue,
                    new: value,
                }
            }
        }

        $gameVariables.changed = this.changedVariables;
        $gameVariables.log = this.variableLogs;
        $gameVariables.diff = this.variableDiff;
        $gameVariables.setValue = function (variableId, value) {
            const oldValue = this.value(variableId);
            if (oldValue != value) {
                this._data[variableId] = value;
                this.onChange(variableId);
                this.changed.add(variableId);
                this.log.push({
                    id: variableId,
                    value: value,
                    oldValue: oldValue,
                });
                this.diff[variableId] = {
                    old: this.diff.old ?? oldValue,
                    new: value,
                }
            }
        }
    }

    clear() {
        this.changedSwitches.clear();
        this.changedSelfSwitches.clear();
        this.changedVariables.clear();
        this.switchLogs.splice(0, this.switchLogs.length);
        this.selfSwitchLogs.splice(0, this.selfSwitchLogs.length);
        this.variableLogs.splice(0, this.variableLogs.length);
        for (const key in this.switchDiff) {
            delete this.switchDiff[key];
        }
        for (const key in this.selfSwitchDiff) {
            delete this.selfSwitchDiff[key];
        }
        for (const key in this.variableDiff) {
            delete this.variableDiff[key];
        }
    }

    capture() {
        const switches = [...this.changedSwitches];
        const selfSwitches = [...this.changedSelfSwitches];
        const variables = [...this.changedVariables];
        const switchLogs = [...this.switchLogs];
        const selfSwitchLogs = [...this.selfSwitchLogs];
        const variableLogs = [...this.variableLogs];
        const switchDiff = { ...this.switchDiff };
        const selfSwitchDiff = { ...this.selfSwitchDiff };
        const variableDiff = { ...this.variableDiff };
        return {
            changed: {
                switches: switches,
                selfSwitches: selfSwitches,
                variables: variables,
            },
            logs: {
                switches: switchLogs,
                selfSwitches: selfSwitchLogs,
                variables: variableLogs,
            },
            diff: {
                switches: switchDiff,
                selfSwitches: selfSwitchDiff,
                variables: variableDiff,
            }
        };
    }

    restore(capture) {
        for (const switchId of this.changedSwitches) {
            $gameSwitches.setValue(switchId, this.switchDiff[switchId].old);
        }
        for (const selfSwitchId of this.changedSelfSwitches) {
            $gameSelfSwitches.setValue(selfSwitchId, this.selfSwitchDiff[selfSwitchId].old);
        }
        for (const variableId of this.changedVariables) {
            $gameVariables.setValue(variableId, this.variableDiff[variableId].old);
        }
        if (capture) {
            for (const switchId of capture.changed.switches) {
                $gameSwitches.setValue(switchId, capture.diff.switches[switchId].new);
            }
            for (const selfSwitchId of capture.changed.selfSwitches) {
                $gameSelfSwitches.setValue(selfSwitchId, capture.diff.selfSwitches[selfSwitchId].new);
            }
            for (const variableId of capture.changed.variables) {
                $gameVariables.setValue(variableId, capture.diff.variables[variableId].new);
            }
        }
    }
}

function findEvent(x, y, index) {
    const events = $gameMap.eventsXy(x, y);
    if (events.length < 0) {
        console.log("No event found.");
    } else if (events.length > 1 && index == undefined) {
        console.log("Multiple events found.");
    } else {
        const event = events[index ?? 0];
        if (event) {
            showEvent(event);
        }
        return event;
    }
}

function unlockRange(x1, y1, x2, y2) {
    const events = $gameMap.events();
    for (const event of events) {
        const x = event.x;
        const y = event.y;
        if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
            unlockEvent(x, y);
        }
    }
}

function unlockEvent(x, y, index = 1) {
    const event = findEvent(x, y);
    if (event) {
        const page = event.event().pages[index] ?? event.event().pages[0];
        if (!page || !pageHasCondition(page)) {
            console.log("No page found.");
            return;
        }
        if (page.conditions.selfSwitchValid) {
            const selfSwitchCh = page.conditions.selfSwitchCh;
            const selfSwitch = selfSwitchTools(event.eventId(), selfSwitchCh);
            if (selfSwitch) {
                console.log("Event already unlocked.");
            } else {
                selfSwitchTools(event.eventId(), selfSwitchCh, true);
                console.log("Event unlocked.");
            }
        }
        if (page.conditions.switch1Valid) {
            const switchId = page.conditions.switch1Id;
            const switchValue = $gameSwitches.value(switchId);
            if (switchValue) {
                console.log("Event already unlocked.");
            } else {
                $gameSwitches.setValue(switchId, true);
                console.log("Event unlocked.");
            }
        }
        if (page.conditions.switch2Valid) {
            const switchId = page.conditions.switch2Id;
            const switchValue = $gameSwitches.value(switchId);
            if (switchValue) {
                console.log("Event already unlocked.");
            } else {
                $gameSwitches.setValue(switchId, true);
                console.log("Event unlocked.");
            }
        }
        if (page.conditions.switch3Valid) {
            const switchId = page.conditions.switch3Id;
            const switchValue = $gameSwitches.value(switchId);
            if (switchValue) {
                console.log("Event already unlocked.");
            } else {
                $gameSwitches.setValue(switchId, true);
                console.log("Event unlocked.");
            }
        }
        if (page.conditions.variableValid) {
            const variableId = page.conditions.variableId;
            const variableValue = $gameVariables.value(variableId);
            if (variableValue == page.conditions.variableValue) {
                console.log("Event already unlocked.");
            } else {
                $gameVariables.setValue(variableId, page.conditions.variableValue);
                console.log("Event unlocked.");
            }
        }
    }
}

/**
 * @param {RPG.EventPage} page
 */
function pageHasCondition(page) {
    return page.conditions.actorValid ||
        page.conditions.itemValid ||
        page.conditions.selfSwitchValid ||
        page.conditions.switch1Valid ||
        page.conditions.switch2Valid ||
        page.conditions.switch3Valid ||
        page.conditions.variableValid;
}

/**
 * @param {Game_Event} event
 */
function showEvent(event) {
    console.log("Event ID: " + event.eventId());
    console.log("Name: " + event.event().name);
    console.log("Note: " + event.event().note);
    console.log("Pages: " + event.event().pages.length);
    for (let i = 0; i < event.event().pages.length; i++) {
        showEventPage(event, i);
    }
}

const WIDTH = 60;

function boxHeader(text) {
    const box = `┌──${text}${"─".repeat(WIDTH - text.length - 3)}┐`;
    console.log(box);
}

function boxHeader2(text, level = 1) {
    const box = `├${"──".repeat(level)}${text}${"─".repeat(WIDTH - text.length - 1 - level * 2)}┤`;
    console.log(box);
}

function boxContent(...args) {
    if (WIDTH - args.join(" ").length - 2 < 0) console.log(args.join(" "));
    else {
        const box = `│ ${args.join(" ")}${" ".repeat(WIDTH - args.join(" ").length - 2)}│`;
        console.log(box);
    }
}

function boxFooter() {
    const box = `└${"─".repeat(WIDTH - 1)}┘`;
    console.log(box);
}

/**
 * @param {Game_Event} event
 * @param {number} page
 */
function showEventPage(event, page) {
    const pages = event.event().pages;
    const pageData = pages[page];
    const pageId = page + 1;

    boxHeader(`Page ${pageId}/${pages.length}`);
    boxHeader2(`Conditions`);
    if (pageData.conditions.actorValid)
        boxContent(`Actor: ${pageData.conditions.actorId}`);
    if (pageData.conditions.itemValid)
        boxContent(`Item: ${pageData.conditions.itemId}`);
    if (pageData.conditions.selfSwitchValid)
        boxContent(`Self Switch: ${pageData.conditions.selfSwitchCh}`);
    if (pageData.conditions.switch1Valid)
        boxContent(`Switch: ${pageData.conditions.switch1Id}`);
    if (pageData.conditions.switch2Valid)
        boxContent(`Switch: ${pageData.conditions.switch2Id}`);
    if (pageData.conditions.switch3Valid)
        boxContent(`Switch: ${pageData.conditions.switch3Id}`);
    if (pageData.conditions.variableValid)
        boxContent(`Variable: \${${pageData.conditions.variableId}} = ${pageData.conditions.variableValue}`);
    boxHeader2(`Commands`);
    boxContent(`Indent Code Name Parameters`);
    for (let i = 0; i < pageData.list.length; i++) {
        const command = pageData.list[i];
        const commandId = command.code;
        const commandName = commandCode[commandId] ?? "Unknown";
        const commandIndent = command.indent;
        const commandParameterInfo = commandParameter[commandId] ?? [];
        const commandParameters = command.parameters;
        const commandParametersString = commandParameters.join(" ");
        boxContent(`${commandIndent} ${commandId}`);
        if (Array.isArray(commandParameterInfo[0])) {
            boxContent(`└${commandName}`);
            for (let i = 0; i < commandParameterInfo.length; i++) {
                boxContent(`└[${i + 1}]─(${commandParameterInfo[i]})`);
            }
        } else
            boxContent(`└${commandName}(${commandParameterInfo})`);
        boxContent(`-> ${commandParametersString}`);
    }
    boxFooter();
    console.log(pageData);
}

function selfSwitchTools(eventId, selfSwitchCh, value = undefined) {
    const mapId = $gameMap.mapId();
    if (value != undefined) {
        return $gameSelfSwitches.setValue([mapId, eventId, selfSwitchCh], value);
    }
    return $gameSelfSwitches.value([mapId, eventId, selfSwitchCh]);
}

/**
 * @param {Game_Event} event
 */
function parse(event, page = 0) {
    console.log("Event ID: " + event.eventId());
    console.log("Name: " + event.event().name);
    console.log("Note: " + event.event().note);
    console.log("Pages: " + event.event().pages.length + " (Showing page " + (page + 1) + ")");
    console.log("000:  {");
    event.event().pages[0].list.forEach((command, i, arr) => {
        let result = parseCommand(command, arr[i + 1]);
        if (!Array.isArray(result)) result = [result];
        result.forEach(x => {
            console.log(`${(i + 1).toString().padStart(3, "0")}: ${x}`);
        });
    });
}

/**
 * @param {RPG.EventCommand[]} list 
 */
function parseWithList(list) {
    list.forEach((command, i, arr) => {
        let result = parseCommandIndent(command, arr[i + 1]);
        if (!Array.isArray(result)) result = [result];
        result.forEach(x => {
            console.log(`${(i + 1).toString().padStart(3, "0")}: ${x}`);
        });
    });
}

/**
 * @param {RPG.EventCommand} command
 */
function parseCommandIndent(command, next) {
    if (!command) return;
    const indent = "  ".repeat(command.indent);// + "└";
    if (command.code === 0) {
        if (command.indent === 0)
            return `${indent} }`;
        return `${"  ".repeat(command.indent - 1)} }`;
    }
    const result = parseCommand(command, next);
    if (Array.isArray(result))
        return result.map(x => `${indent} ${x}`);
    return `${indent} ${result}`;
}

function parseCommand(command, next) {
    if (eval(`typeof parseCommand${command.code} === "function"`)) {
        return eval(`parseCommand${command.code}(command, next)`);
    }
    return `@${command.code}`;
}

function parseOperateValue(operation, operandType, operand) {
    return `${operation === 0 ? "" : "-"}${operandType === 0 ? operand : `$gameVariables.value(${operand})`}`
}

function parseOperateVariable(variableId, operationType, value) {
    let res = [`// $${variableId} <-- $gameVariables.value(${variableId})`]
    switch (operationType) {
        case 0:
            res.push(`$${variableId} = ${value}`);
            break;
        case 1:
            res.push(`$${variableId} += ${value}`);
            break;
        case 2:
            res.push(`$${variableId} -= ${value}`);
            break;
        case 3:
            res.push(`$${variableId} *= ${value}`);
            break;
        case 4:
            res.push(`$${variableId} /= ${value}`);
            break;
        case 5:
            res.push(`$${variableId} %= ${value}`);
            break;
    }
    return res;
}

function parseGameDataOperand(type, param1, param2) {
    switch (type) {
        case 0:
            return `$gameParty.numItems(${param1})`;
        case 1:
            return `$gameParty.numWeapons(${param1})`;
        case 2:
            return `$gameParty.numArmors(${param1})`;
        case 3:
            switch (param2) {
                case 0:
                    return `$gameActors.actor(${param1}).level`;
                case 1:
                    return `$gameActors.actor(${param1}).exp`;
                case 2:
                    return `$gameActors.actor(${param1}).hp`;
                case 3:
                    return `$gameActors.actor(${param1}).mp`;
                case 4:
                    return `$gameActors.actor(${param1}).tp`;
                default:
                    if (param2 >= 4 && param2 <= 11) {
                        return `$gameActors.actor(${param1}).param(${param2 - 4})`;
                    }
            }
            break;
        case 4:
            switch (param2) {
                case 0:
                    return `$gameTroop.members()[${param1}].hp`;
                case 1:
                    return `$gameTroop.members()[${param1}].mp`;
                case 10:
                    return `$gameTroop.members()[${param1}].tp`;
                default:
                    if (param2 >= 2 && param2 <= 9) {
                        return `$gameTroop.members()[${param1}].param(${param2 - 2})`;
                    }
            }
            break;
        case 5:
            switch (param2) {
                case 0:
                    return `this.character(${param1}).x`;
                case 1:
                    return `this.character(${param1}).y`;
                case 2:
                    return `this.character(${param1}).direction`;
                case 3:
                    return `this.character(${param1}).screenX()`;
                case 4:
                    return `this.character(${param1}).screenY()`;
            }
            break;
        case 6:
            return `$gameParty.members()[${param1}].actorId() ?? 0`;
        case 8:
            return `$gameTemp.lastActionData(${param1})`;
        case 7:
            switch (param1) {
                case 0: // Map ID
                    return `$gameMap.mapId()`;
                case 1: // Party Members
                    return `$gameParty.size()`;
                case 2: // Gold
                    return `$gameParty.gold()`;
                case 3: // Steps
                    return `$gameParty.steps()`;
                case 4: // Play Time
                    return `$gameSystem.playtime()`;
                case 5: // Timer
                    return `$gameTimer.seconds()`;
                case 6: // Save Count
                    return `$gameSystem.saveCount()`;
                case 7: // Battle Count
                    return `$gameSystem.battleCount()`;
                case 8: // Win Count
                    return `$gameSystem.winCount()`;
                case 9: // Escape Count
                    return `$gameSystem.escapeCount()`;
            }
            break;
    }
}

function parseCommand0(command) {
    const parameters = command.parameters;
    return `}`;
}

function parseCommand101(command, next) {
    const result = [];
    result.push(`let dialog = new Dialog();`);
    result.push(`dialog.setFaceImage(${parameters[0]}, ${parameters[1]});`);
    result.push(`dialog.setBackground(${parameters[2]});`);
    result.push(`dialog.setPositionType(${parameters[3]});`);
    result.push(`dialog.setSpeakerName(${parameters[4]});`);
    return result;
}

function parseCommand102(command) {
    const result = [];
    result.push(`dialog.setChoices(`);
    result.push(`  choices: ${JSON.stringify(command.parameters[0])},`);
    result.push(`  cancelType: ${JSON.stringify(command.parameters[1])},`);
    result.push(`  defaultType: ${JSON.stringify(command.parameters[2] ?? 0)},`);
    result.push(`);`);
    result.push(`dialog.setChoiceBackground(${command.parameters[4] ?? 0});`);
    result.push(`dialog.setChoicePositionType(${command.parameters[3] ?? 2});`);
    result.push(`dialog.showChoices();`);
    return result;
}

function parseCommand103(command) {
    const result = [];
    result.push(`dialog.setNumberInput(`);
    result.push(`  variableId: ${command.parameters[0]},`);
    result.push(`  maxDigits: ${command.parameters[1]},`);
    result.push(`);`);
    result.push(`dialog.showNumberInput();`);
    return result;
}

function parseCommand104(command) {
    const result = [];
    result.push(`dialog.setItemChoice(`);
    result.push(`  variableId: ${command.parameters[0]},`);
    result.push(`  itemType: ${command.parameters[1] ?? 2},`);
    result.push(`);`);
    result.push(`dialog.showItemChoice();`);
    return result;
}

function parseCommand108(command) {
    const comment = command.parameters[0];
    return `// ${comment}`;
}

function parseCommand117(command) {
    const commonEventId = command.parameters[0];
    return `callCommonEvent(${commonEventId})`;
}

function parseCommand121(command) {
    const switchIdStart = command.parameters[0];
    const switchIdEnd = command.parameters[1];
    const switchValue = command.parameters[2];
    return [
        `for (let i = ${switchIdStart}; i <= ${switchIdEnd}; i++) {`,
        `  $gameSwitches.setValue(i, ${switchValue === 0})`,
        `}`,
    ]
}

function parseCommand122(command) {
    const startId = command.parameters[0];
    const endId = command.parameters[1];
    const operationType = command.parameters[2];
    const operand = command.parameters[3];

    let res = [];
    switch (operand) {
        case 0:
            res.push(`let value = ${command.parameters[4]}`);
            break;
        case 1:
            res.push(`let value = $gameVariables.value(${command.parameters[4]})`);
            break;
        case 2:
            res.push(`let value = ${command.parameters[4]} + Math.randomInt(Math.max(${command.parameters[5]} - ${command.parameters[4]} + 1, 1))`);
            break;
        case 3:
            res.push(`let value = ${parseGameDataOperand(command.parameters[4], command.parameters[5], command.parameters[6])}}`);
            break;
        case 4:
            res.push(`let value = eval(${command.parameters[4]})`);
            break;
    }
    for (let i = startId; i <= endId; i++) {
        res.push(...parseOperateVariable(i, operationType, "value"));
    }
    return res;
}

function parseCommand126(command) {
    const item = command.parameters[0];
    const operation = command.parameters[1];
    const operandType = command.parameters[2];
    const operand = command.parameters[3];
    return `changeItems(${item}, ${parseOperateValue(operation, operandType, operand)})`;
}

function parseCommand205(command) {
    const id = command.parameters[0];
    const character = id < 0 ? "$gamePlayer" : id == 0 ? "$gameMap.event(this._eventId)" : `$gameMap.event(${id})`;
    /**
     * @type {{
     *  list: RPG.EventCommand[],
     *  repeat: boolean,
     *  skippable: boolean,
     *  wait: boolean,
     * }}
     */
    const operation = command.parameters[1];
    let result = [
        `move(`,
        `  ${character},`,
        `  ${JSON.stringify(operation)}`,
        // `  () => {`,
        // ...operation.list.map(parseCommand).map(x => `  ${x}`),
        `)`,
    ];
    if (operation.wait) {
        result.push(`this.setWaitMode("route")`);
    }
    return result;
}

/**
 * @param {RPG.EventCommand} command
 * @param {RPG.EventCommand} next
 */
function parseCommand355(command, next) {
    const script = command.parameters[0];
    if (next.code === 655)
        return [`eval(`, script];
    return `eval(${script})`;
}

/**
 * Plugin Command
 * @param {RPG.EventCommand} command
 */
function parseCommand357(command) {
    const pluginName = command.parameters[0];
    console.log(PluginManager._commands[`${pluginName}:${command.parameters[1]}`]);
    return `PluginManager.callCommand(this, "${pluginName}", ${JSON.stringify(command.parameters[1])}, ${JSON.stringify(command.parameters[3])})`;
}

function parseCommand401(command) {
    return `dialog.addText("${command.parameters[0]}")`;
}

function parseCommand402(command) {
    return `if (dialog.choice() == ${command.parameters[0]}) {`;
}

/**
 * @param {RPG.EventCommand} command
 * @param {RPG.EventCommand} next
 */
function parseCommand655(command, next) {
    const script = command.parameters[0];
    if (next.code === 655)
        return script;
    return [script, `)`];
}

/**
 * @param {RPG.EventCommand} command
 */
function parseCommand111(command) {
    const typeMap = {
        0: "Switch",
        1: "Variable",
        2: "Self Switch",
        3: "Timer",
        4: "Actor",
        5: "Enemy",
        6: "Character",
        7: "Gold",
        8: "Item",
        9: "Weapon",
        10: "Armor",
        11: "Button",
        12: "Script",
        13: "Vehicle",
    }

    const type = command.parameters[0];

    switch (type) {
        case 0:
            return `if ($gameSwitches.value(${command.parameters[1]}) == ${command.parameters[2] == 0}) {`;
        case 8:
            return `if (hasItem(${command.parameters[1]})) {`;
        case 9:
            return `if (hasWeapon(${command.parameters[1]})) {`;
        case 10:
            return `if (hasArmor(${command.parameters[1]})) {`;
        case 12:
            return `if (eval(${command.parameters[1]})) {`;
    }
}

/**
 * @param {RPG.EventCommand} command
 */
function parseCommand411(command) {
    return `else {`;
}
