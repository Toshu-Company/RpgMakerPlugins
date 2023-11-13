declare const commandCode: Record<number, string>;
declare const commandParameter: Record<number, string[] | string[][]>;
declare class Information {
    switchNames: string[];
    constructor();
    switch(id: number): {
        id: number;
        name: string;
        value: boolean;
    };
    setSwitch(id: number, value: boolean): void;
}
declare class Debugger {
    changedSwitches: Set<number>;
    changedSelfSwitches: Set<string>;
    changedVariables: Set<number>;
    switchLogs: Game_Switches["log"];
    selfSwitchLogs: Game_SelfSwitches["log"];
    variableLogs: Game_Variables["log"];
    switchDiff: Game_Switches["diff"];
    selfSwitchDiff: Game_SelfSwitches["diff"];
    variableDiff: Game_Variables["diff"];
    information: Information;
    constructor();
    attach(): void;
    clear(): void;
    capture(): Debugger.Capture;
    restore(capture: Debugger.Capture): void;
}
/**
 * @param {Game_Event} event
 */
declare function showEvent(event: Game_Event): void;
declare function showEventPage(event: Game_Event, page: number): void;
declare const WIDTH = 60;
declare function boxHeader(text: string): void;
declare function boxHeader2(text: string, level?: number): void;
declare function boxContent(...args: string[]): void;
declare function boxFooter(): void;
declare function unlockRange(x1: number, y1: number, x2: number, y2: number): void;
declare function unlockEvent(x: number, y: number, index?: number): void;
declare function findEvent(x: number, y: number, index?: number): Game_Event | undefined;
declare function pageHasCondition(page: RPG.EventPage): boolean;
declare function selfSwitchTools(eventId: number, selfSwitchCh: string, value?: boolean | undefined): boolean | void;
declare function parseCommand0(command: RPG.EventCommand): string;
declare function parseCommand412(command: RPG.EventCommand): string;
declare function parseCommand404(command: RPG.EventCommand): string;
declare function parseCommand101(command: RPG.EventCommand, next: RPG.EventCommand): string[];
declare function parseCommand102(command: RPG.EventCommand): string[];
declare function parseCommand103(command: RPG.EventCommand): string[];
declare function parseCommand104(command: RPG.EventCommand): string[];
declare function parseCommand108(command: RPG.EventCommand): string;
declare function parseCommand117(command: RPG.EventCommand): string;
declare function parseCommand121(command: RPG.EventCommand): string[];
declare function parseCommand122(command: RPG.EventCommand): string[];
declare function parseCommand126(command: RPG.EventCommand): string;
declare function parseCommand205(command: RPG.EventCommand): string[];
declare function parseCommand231(command: RPG.EventCommand): string[];
declare function parseCommand235(command: RPG.EventCommand): string;
declare function parseCommand250(command: RPG.EventCommand): string[];
declare function parseCommand301(command: RPG.EventCommand): string[];
declare function parseCommand355(command: RPG.EventCommand, next: RPG.EventCommand): string | any[];
declare function parseCommand357(command: RPG.EventCommand): string;
declare function parseCommand401(command: RPG.EventCommand): string;
declare function parseCommand402(command: RPG.EventCommand): string;
declare function parseCommand601(command: RPG.EventCommand): string;
declare function parseCommand602(command: RPG.EventCommand): string;
declare function parseCommand603(command: RPG.EventCommand): string;
declare function parseCommand655(command: RPG.EventCommand, next: RPG.EventCommand): any;
declare function parseCommand111(command: RPG.EventCommand): string;
declare function parseCommand411(command: RPG.EventCommand): string;
declare function parse(event: Game_Event, page?: number): void;
declare function parseWithList(list: RPG.EventCommand[]): void;
declare function parseCommandIndent(command: RPG.EventCommand, next: RPG.EventCommand): string | string[];
declare function parseCommand(command: RPG.EventCommand, next: RPG.EventCommand): any;
declare function parseOperateValue(operation: number, operandType: number, operand: number): string;
declare function parseOperateVariable(variableId: number, operationType: number, value: string | number): string[];
declare function parseGameDataOperand(type: number, param1: any, param2: any): string | undefined;
declare function JSONStringify(value: any): string[];
