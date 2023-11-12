function parse(event: Game_Event, page = 0) {
  console.log("Event ID: " + event.eventId());
  console.log("Name: " + event.event().name);
  console.log("Note: " + event.event().note);
  console.log(
    "Pages: " +
      event.event().pages.length +
      " (Showing page " +
      (page + 1) +
      ")"
  );
  console.log("000:  {");
  event.event().pages[page].list.forEach((command, i, arr) => {
    let result = parseCommandIndent(command, arr[i + 1]);
    if (!Array.isArray(result)) result = [result];
    result.forEach((x) => {
      console.log(`${(i + 1).toString().padStart(3, "0")}: ${x}`);
    });
  });
}

function parseWithList(list: RPG.EventCommand[]) {
  list.forEach((command, i, arr) => {
    let result = parseCommandIndent(command, arr[i + 1]);
    if (!Array.isArray(result)) result = [result];
    result.forEach((x) => {
      console.log(`${(i + 1).toString().padStart(3, "0")}: ${x}`);
    });
  });
}

function parseCommandIndent(command: RPG.EventCommand, next: RPG.EventCommand) {
  const indent = "  ".repeat(command.indent); // + "└";
  if (command.code === 0) {
    if (command.indent === 0) return `${indent} }`;
    return `${"  ".repeat(command.indent - 1)} }`;
  }
  const result = parseCommand(command, next);
  if (Array.isArray(result)) return result.map((x) => `${indent} ${x}`);
  return `${indent} ${result}`;
}

function parseCommand(command: RPG.EventCommand, next: RPG.EventCommand) {
  if (eval(`typeof parseCommand${command.code} === "function"`)) {
    return eval(`parseCommand${command.code}(command, next)`);
  }
  return `@${command.code}`;
}
