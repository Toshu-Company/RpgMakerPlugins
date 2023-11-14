/// <reference types="react" />
declare function createCanvas(id?: string): HTMLCanvasElement;
declare function drawTile(x: number, y: number, canvas?: string): void;
declare function mouseToPosition(mx: number, my: number): {
    x: number;
    y: number;
};
declare const useState: typeof React.useState, useEffect: typeof React.useEffect, useCallback: typeof React.useCallback;
declare function Root(): JSX.Element;
declare function SceneGlossary(): React.JSX.Element;
declare function TorigoyaComponent(): React.JSX.Element;
declare namespace TorigoyaTools {
    namespace MZ_Achievement2 {
        function data(): void;
    }
}
