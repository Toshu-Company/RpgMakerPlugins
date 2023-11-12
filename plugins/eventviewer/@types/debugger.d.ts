interface Game_Switches {
  changed: Set<number>;
  log: Debugger.Log<number, boolean>[];
  diff: Record<number, Debugger.Diff<boolean>>;
}

interface Game_Variables {
  changed: Set<number>;
  log: Debugger.Log<number, number>[];
  diff: Record<number, Debugger.Diff<number>>;
}

interface Game_SelfSwitches {
  changed: Set<string>;
  log: Debugger.Log<string, boolean>[];
  diff: Record<string, Debugger.Diff<boolean>>;
}

declare namespace Debugger {
  interface Diff<T> {
    old: T;
    new: T;
  }

  interface Log<K, V> {
    id: K;
    value: V;
    oldValue: V;
  }

  interface Capture {
    changed: {
      switches: Array<number>;
      variables: Array<number>;
      selfSwitches: Array<string>;
    };

    logs: {
      switches: Game_Switches["log"];
      variables: Game_Variables["log"];
      selfSwitches: Game_SelfSwitches["log"];
    };

    diff: {
      switches: Game_Switches["diff"];
      variables: Game_Variables["diff"];
      selfSwitches: Game_SelfSwitches["diff"];
    };
  }
}
