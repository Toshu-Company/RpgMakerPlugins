import RMMV from "./rmmv";
import RMMVPixi from "./rmmv-pixi";

// declare global {
//   var $gameMap: RMMV.Game_Map;
// }

declare module NodeJS {
  interface Global extends RMMV, RMMVPixi {}
}
