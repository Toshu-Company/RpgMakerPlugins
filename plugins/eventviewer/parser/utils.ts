function parseOperateValue(
  operation: number,
  operandType: number,
  operand: number
) {
  return `${operation === 0 ? "" : "-"}${
    operandType === 0 ? operand : `$gameVariables.value(${operand})`
  }`;
}

function parseOperateVariable(
  variableId: number,
  operationType: number,
  value: string | number
) {
  let res = [`// $${variableId} <-- $gameVariables.value(${variableId})`];
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

function parseGameDataOperand(type: number, param1: any, param2: any) {
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

function JSONStringify(value: any): string[] {
  return JSON.stringify(value, null, 2)
    .split("\n")
    .map((x) => `  ${x}`);
}

class RPGMakerVersion {
  major: number;
  minor: number;
  patch: number;
  constructor(public version: string) {
    const [major, minor, patch] = version.split(".").map((x) => parseInt(x));
    this.major = major;
    this.minor = minor;
    this.patch = patch;
  }

  ["<"](other: RPGMakerVersion | string) {
    if (typeof other === "string") other = new RPGMakerVersion(other);
    return (
      this.major < other.major ||
      (this.major === other.major &&
        (this.minor < other.minor ||
          (this.minor === other.minor && this.patch < other.patch)))
    );
  }

  [">"](other: RPGMakerVersion | string) {
    if (typeof other === "string") other = new RPGMakerVersion(other);
    return (
      this.major > other.major ||
      (this.major === other.major &&
        (this.minor > other.minor ||
          (this.minor === other.minor && this.patch > other.patch)))
    );
  }

  ["<="](other: RPGMakerVersion | string) {
    if (typeof other === "string") other = new RPGMakerVersion(other);
    return (
      this.major < other.major ||
      (this.major === other.major &&
        (this.minor < other.minor ||
          (this.minor === other.minor && this.patch <= other.patch)))
    );
  }

  [">="](other: RPGMakerVersion | string) {
    if (typeof other === "string") other = new RPGMakerVersion(other);
    return (
      this.major > other.major ||
      (this.major === other.major &&
        (this.minor > other.minor ||
          (this.minor === other.minor && this.patch >= other.patch)))
    );
  }

  ["=="](other: RPGMakerVersion | string) {
    if (typeof other === "string") other = new RPGMakerVersion(other);
    return (
      this.major === other.major &&
      this.minor === other.minor &&
      this.patch === other.patch
    );
  }

  ["~"](other: RPGMakerVersion | string) {
    if (typeof other === "string") other = new RPGMakerVersion(other);
    return (
      this.major === other.major &&
      this.minor === other.minor &&
      this.patch >= other.patch
    );
  }

  ["^"](other: RPGMakerVersion | string) {
    if (typeof other === "string") other = new RPGMakerVersion(other);
    return (
      this.major === other.major &&
      this.minor >= other.minor &&
      this.patch >= other.patch
    );
  }
}
