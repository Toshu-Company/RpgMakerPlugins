declare class Scene_Glossary {}
declare class Window_GlossaryCategory {}
declare class Window_GlossaryList {}
declare class Window_GlossaryConfirm {}
declare class Window_Glossary {}
declare class Window_GlossaryComplete {}

interface Window {
  Scene_Glossary: Scene_Glossary;
  Window_GlossaryCategory: Window_GlossaryCategory;
  Window_GlossaryList: Window_GlossaryList;
  Window_GlossaryConfirm: Window_GlossaryConfirm;
  Window_Glossary: Window_Glossary;
  Window_GlossaryComplete: Window_GlossaryComplete;
}

interface Game_Interpreter {
  pluginCommandSceneGlossary(command: string, ...args: string[]): void;
}

interface Game_Party {
  gainGlossaryAll(): void;
  loseGlossaryAll(): void;
}
