function parseCommand0(command: RPG.EventCommand) {
  return `}`;
}

function parseCommand101(command: RPG.EventCommand, next: RPG.EventCommand) {
  const parameters = command.parameters;
  const result = [];
  result.push(`let dialog = new Dialog();`);
  result.push(`dialog.setFaceImage(${parameters[0]}, ${parameters[1]});`);
  result.push(`dialog.setBackground(${parameters[2]});`);
  result.push(`dialog.setPositionType(${parameters[3]});`);
  result.push(`dialog.setSpeakerName(${parameters[4]});`);
  return result;
}

function parseCommand102(command: RPG.EventCommand) {
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

function parseCommand103(command: RPG.EventCommand) {
  const result = [];
  result.push(`dialog.setNumberInput(`);
  result.push(`  variableId: ${command.parameters[0]},`);
  result.push(`  maxDigits: ${command.parameters[1]},`);
  result.push(`);`);
  result.push(`dialog.showNumberInput();`);
  return result;
}

function parseCommand104(command: RPG.EventCommand) {
  const result = [];
  result.push(`dialog.setItemChoice(`);
  result.push(`  variableId: ${command.parameters[0]},`);
  result.push(`  itemType: ${command.parameters[1] ?? 2},`);
  result.push(`);`);
  result.push(`dialog.showItemChoice();`);
  return result;
}

function parseCommand108(command: RPG.EventCommand) {
  const comment = command.parameters[0];
  return `// ${comment}`;
}

function parseCommand117(command: RPG.EventCommand) {
  const commonEventId = command.parameters[0];
  return `callCommonEvent(${commonEventId})`;
}

function parseCommand121(command: RPG.EventCommand) {
  const switchIdStart = command.parameters[0];
  const switchIdEnd = command.parameters[1];
  const switchValue = command.parameters[2];
  return [
    `for (let i = ${switchIdStart}; i <= ${switchIdEnd}; i++) {`,
    `  $gameSwitches.setValue(i, ${switchValue === 0})`,
    `}`,
  ];
}

function parseCommand122(command: RPG.EventCommand) {
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
      res.push(
        `let value = ${command.parameters[4]} + Math.randomInt(Math.max(${command.parameters[5]} - ${command.parameters[4]} + 1, 1))`
      );
      break;
    case 3:
      res.push(
        `let value = ${parseGameDataOperand(
          command.parameters[4],
          command.parameters[5],
          command.parameters[6]
        )}}`
      );
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

function parseCommand126(command: RPG.EventCommand) {
  const item = command.parameters[0];
  const operation = command.parameters[1];
  const operandType = command.parameters[2];
  const operand = command.parameters[3];
  return `changeItems(${item}, ${parseOperateValue(
    operation,
    operandType,
    operand
  )})`;
}

function parseCommand205(command: RPG.EventCommand) {
  const id = command.parameters[0];
  const character =
    id < 0
      ? "$gamePlayer"
      : id == 0
      ? "$gameMap.event(this._eventId)"
      : `$gameMap.event(${id})`;
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

function parseCommand231(command: RPG.EventCommand) {
  const pictureId = command.parameters[0];
  const name = command.parameters[1];
  const origin = command.parameters[2];
  const direct = command.parameters[3];
  const x = direct
    ? command.parameters[4]
    : `$gameVariables.value(${command.parameters[4]})`;
  const y = direct
    ? command.parameters[5]
    : `$gameVariables.value(${command.parameters[5]})`;
  const scaleX = command.parameters[6];
  const scaleY = command.parameters[7];
  const opacity = command.parameters[8];
  const blendMode = command.parameters[9];
  return `showPicture(${pictureId}, ${name}, ${origin}, ${direct}, ${x}, ${y}, ${scaleX}, ${scaleY}, ${opacity}, ${blendMode})`;
}

function parseCommand235(command: RPG.EventCommand) {
  return `erasePicture(${command.parameters[0]})`;
}

function parseCommand250(command: RPG.EventCommand) {
  const se = command.parameters[0];
  return `AudioManager.playSE(${JSON.stringify(se)})`;
}

function parseCommand355(command: RPG.EventCommand, next: RPG.EventCommand) {
  const script = command.parameters[0];
  if (next.code === 655) return [`eval(`, script];
  return `eval(${script})`;
}

function parseCommand357(command: RPG.EventCommand) {
  const pluginName = command.parameters[0];
  console.log(
    PluginManager._commands[`${pluginName}:${command.parameters[1]}`]
  );
  return `PluginManager.callCommand(this, "${pluginName}", ${JSON.stringify(
    command.parameters[1]
  )}, ${JSON.stringify(command.parameters[3])})`;
}

function parseCommand401(command: RPG.EventCommand) {
  return `dialog.addText("${command.parameters[0]}")`;
}

function parseCommand402(command: RPG.EventCommand) {
  return `if (dialog.choice() == ${command.parameters[0]}) {`;
}

function parseCommand655(command: RPG.EventCommand, next: RPG.EventCommand) {
  const script = command.parameters[0];
  if (next.code === 655) return script;
  return [script, `)`];
}

function parseCommand111(command: RPG.EventCommand) {
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
  };

  const type = command.parameters[0];

  switch (type) {
    case 0:
      return `if ($gameSwitches.value(${command.parameters[1]}) == ${
        command.parameters[2] == 0
      }) {`;
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

function parseCommand411(command: RPG.EventCommand) {
  return `else {`;
}
