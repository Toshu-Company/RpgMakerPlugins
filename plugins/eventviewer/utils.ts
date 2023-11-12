function findEvent(x: number, y: number, index?: number) {
  const events = $gameMap.eventsXy(x, y);
  if (events.length < 0) {
    console.log("No event found.");
  } else if (events.length > 1 && index == undefined) {
    console.log("Multiple events found.");
  } else {
    return events[index ?? 0];
  }
}

function pageHasCondition(page: RPG.EventPage) {
  return (
    page.conditions.actorValid ||
    page.conditions.itemValid ||
    page.conditions.selfSwitchValid ||
    page.conditions.switch1Valid ||
    page.conditions.switch2Valid ||
    page.conditions.switch3Valid ||
    page.conditions.variableValid
  );
}

function selfSwitchTools(
  eventId: number,
  selfSwitchCh: string,
  value: boolean | undefined = undefined
) {
  const mapId = $gameMap.mapId();
  if (value != undefined) {
    return $gameSelfSwitches.setValue([mapId, eventId, selfSwitchCh], value);
  }
  return $gameSelfSwitches.value([mapId, eventId, selfSwitchCh]);
}
