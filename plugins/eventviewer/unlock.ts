function unlockRange(x1: number, y1: number, x2: number, y2: number) {
  const events = $gameMap.events();
  for (const event of events) {
    const x = event.x;
    const y = event.y;
    if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
      unlockEvent(x, y);
    }
  }
}

function unlockEvent(x: number, y: number, index = 1) {
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
