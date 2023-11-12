interface PluginManagerStatic {
  _commands: {
    [key: string]: (command: RPG.EventCommand) => any;
  };

  registerCommand: (
    this: PluginManagerStatic,
    pluginName: string,
    commandName: string,
    func: (command: RPG.EventCommand) => any
  ) => void;

  callCommand: (
    this: PluginManagerStatic,
    self: Game_Interpreter,
    pluginName: string,
    commandName: string,
    args: string
  ) => void;
}
