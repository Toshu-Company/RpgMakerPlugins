/**
 * @param {Game_Event} event
 */
function showEvent(event: Game_Event) {
  console.log("Event ID: " + event.eventId());
  console.log("Name: " + event.event().name);
  console.log("Note: " + event.event().note);
  console.log("Pages: " + event.event().pages.length);
  for (let i = 0; i < event.event().pages.length; i++) {
    showEventPage(event, i);
  }
}

function showEventPage(event: Game_Event, page: number) {
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
    boxContent(
      `Variable: \${${pageData.conditions.variableId}} = ${pageData.conditions.variableValue}`
    );
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
    } else boxContent(`└${commandName}(${commandParameterInfo})`);
    boxContent(`-> ${commandParametersString}`);
  }
  boxFooter();
  console.log(pageData);
}

const WIDTH = 60;

function boxHeader(text: string) {
  const box = `┌──${text}${"─".repeat(WIDTH - text.length - 3)}┐`;
  console.log(box);
}

function boxHeader2(text: string, level = 1) {
  const box = `├${"──".repeat(level)}${text}${"─".repeat(
    WIDTH - text.length - 1 - level * 2
  )}┤`;
  console.log(box);
}

function boxContent(...args: string[]) {
  if (WIDTH - args.join(" ").length - 2 < 0) console.log(args.join(" "));
  else {
    const box = `│ ${args.join(" ")}${" ".repeat(
      WIDTH - args.join(" ").length - 2
    )}│`;
    console.log(box);
  }
}

function boxFooter() {
  const box = `└${"─".repeat(WIDTH - 1)}┘`;
  console.log(box);
}
