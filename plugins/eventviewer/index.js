const commandCode = {
    101: "Setup Show Text",
    102: "Show Choices",
    103: "Input Number",
    104: "Select Item",
    108: "Comment",
    111: "Conditional Branch",
    117: "Common Event",
    123: "Control Self Switch",
    128: "Change Armor",
    129: "Change Party Member",
    201: "Transfer Player",
    250: "Play SE",
    401: "Text Parameter",
    402: "When [**]",
    403: "When Cancel",
    408: "Comment",
}
const commandParameter = {
    117: ["Common Event ID"],
    123: ["SwitchCh", "On(0)/Off(1)"],
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
        const page = event.event().pages[index];
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