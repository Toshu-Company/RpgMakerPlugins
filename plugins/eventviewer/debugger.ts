class Information {
  switchNames: string[];

  constructor() {
    this.switchNames = $dataSystem.switches.slice();
  }

  switch(id: number) {
    return {
      id: id,
      name: this.switchNames[id],
      value: $gameSwitches.value(id),
    };
  }

  setSwitch(id: number, value: boolean) {
    $gameSwitches.setValue(id, value);
  }
}

class Debugger {
  changedSwitches = new Set<number>();
  changedSelfSwitches = new Set<string>();
  changedVariables = new Set<number>();
  switchLogs: Game_Switches["log"] = [];
  selfSwitchLogs: Game_SelfSwitches["log"] = [];
  variableLogs: Game_Variables["log"] = [];
  switchDiff: Game_Switches["diff"] = {};
  selfSwitchDiff: Game_SelfSwitches["diff"] = {};
  variableDiff: Game_Variables["diff"] = {};

  information = new Information();

  constructor() {}

  attach() {
    $gameSwitches.changed = this.changedSwitches;
    $gameSwitches.log = this.switchLogs;
    $gameSwitches.diff = this.switchDiff;
    $gameSwitches.setValue = function (this: Game_Switches, switchId, value) {
      const oldValue = this.value(switchId);
      if (oldValue != value) {
        this._data[switchId] = value;
        this.onChange();
        this.changed.add(switchId);
        this.log.push({
          id: switchId,
          value: value,
          oldValue: oldValue,
        });
        this.diff[switchId] = {
          old: this.diff[switchId].old ?? oldValue,
          new: value,
        };
      }
    };

    $gameSelfSwitches.changed = this.changedSelfSwitches;
    $gameSelfSwitches.log = this.selfSwitchLogs;
    $gameSelfSwitches.diff = this.selfSwitchDiff;
    $gameSelfSwitches.setValue = function (
      this: Game_SelfSwitches,
      key,
      value
    ) {
      const oldValue = this.value(key);
      if (oldValue != value) {
        (this._data as any)[key.toString()] = value;
        this.onChange();
        this.changed.add(key.toString());
        this.log.push({
          id: key.toString(),
          value: value,
          oldValue: oldValue,
        });
        this.diff[key.toString()] = {
          old: this.diff[key.toString()].old ?? oldValue,
          new: value,
        };
      }
    };

    $gameVariables.changed = this.changedVariables;
    $gameVariables.log = this.variableLogs;
    $gameVariables.diff = this.variableDiff;
    $gameVariables.setValue = function (
      this: Game_Variables,
      variableId,
      value
    ) {
      const oldValue = this.value(variableId);
      if (oldValue != value) {
        this._data[variableId] = value;
        this.onChange();
        this.changed.add(variableId);
        this.log.push({
          id: variableId,
          value: value,
          oldValue: oldValue,
        });
        this.diff[variableId] = {
          old: this.diff[variableId].old ?? oldValue,
          new: value,
        };
      }
    };
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

  capture(): Debugger.Capture {
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
      },
    };
  }

  restore(capture: Debugger.Capture) {
    for (const switchId of this.changedSwitches) {
      $gameSwitches.setValue(switchId, this.switchDiff[switchId].old);
    }
    for (const selfSwitchId of this.changedSelfSwitches) {
      $gameSelfSwitches.setValue(
        selfSwitchId.split(",").map((x) => parseInt(x)),
        this.selfSwitchDiff[selfSwitchId].old
      );
    }
    for (const variableId of this.changedVariables) {
      $gameVariables.setValue(variableId, this.variableDiff[variableId].old);
    }
    if (capture) {
      for (const switchId of capture.changed.switches) {
        $gameSwitches.setValue(switchId, capture.diff.switches[switchId].new);
      }
      for (const selfSwitchId of capture.changed.selfSwitches) {
        $gameSelfSwitches.setValue(
          selfSwitchId.split(",").map((x) => parseInt(x)),
          capture.diff.selfSwitches[selfSwitchId].new
        );
      }
      for (const variableId of capture.changed.variables) {
        $gameVariables.setValue(
          variableId,
          capture.diff.variables[variableId].new
        );
      }
    }
  }
}
