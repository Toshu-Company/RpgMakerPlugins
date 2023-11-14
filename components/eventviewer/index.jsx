"use strict";
function createCanvas(id = "EventViewerCanvas") {
    const canvas = document.createElement("canvas");
    const width = SceneManager._screenWidth;
    const height = SceneManager._screenHeight;
    canvas.id = id;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    document.body.appendChild(canvas);
    const updateAllElements = Graphics._updateAllElements;
    Graphics._updateAllElements = () => {
        updateAllElements.call(Graphics);
        canvas.width = Graphics.width;
        canvas.height = Graphics.height;
        canvas.style.width = Graphics.width + "px";
        canvas.style.height = Graphics.height + "px";
    };
    return canvas;
}
function drawTile(x, y, canvas = "EventViewerCanvas") {
    const uppercanvas = document.getElementById(canvas);
    if (!uppercanvas)
        return console.error("Canvas not found");
    const dx = $gameMap.displayX();
    const dy = $gameMap.displayY();
    const tileWidth = $gameMap.tileWidth();
    const tileHeight = $gameMap.tileHeight();
    const tx = Math.floor((x - dx) * tileWidth);
    const ty = Math.floor((y - dy) * tileHeight);
    function fillRect2d(ctx) {
        if (!ctx)
            return;
        ctx.fillStyle = `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;
        ctx.fillRect(tx, ty, tileWidth, tileHeight);
    }
    function fillRectWebGL(ctx) {
        if (!ctx)
            return;
    }
    fillRect2d(uppercanvas.getContext("2d"));
    fillRectWebGL(uppercanvas.getContext("webgl"));
}
function mouseToPosition(mx, my) {
    const dx = $gameMap.displayX();
    const dy = $gameMap.displayY();
    const tileWidth = $gameMap.tileWidth();
    const tileHeight = $gameMap.tileHeight();
    const x = Math.floor(mx / tileWidth + dx);
    const y = Math.floor(my / tileHeight + dy);
    return { x, y };
}
const { useState, useEffect, useCallback } = React;
function Root() {
    const [visible, setVisible] = useState(false);
    const onKeyUp = useCallback((event) => {
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyE') {
            setVisible((visible) => !visible);
        }
    }, []);
    useEffect(() => {
        document.addEventListener('keyup', onKeyUp);
        return () => document.removeEventListener('keyup', onKeyUp);
    }, []);
    return (<div style={{ display: visible ? 'block' : 'none' }}>
            <h1>Event Viewer</h1>
            <SceneGlossary />
        </div>);
}
(() => {
    function run() {
        if (document.getElementById('eventviewer')) {
            console.log('EventViewer already loaded.');
            return;
        }
        const domContainer = document.createElement('div');
        domContainer.id = 'eventviewer';
        document.body.appendChild(domContainer);
        const root = ReactDOM.createRoot(domContainer);
        root.render(React.createElement(Root));
        console.log('EventViewer loaded.');
        const canvas = createCanvas();
        canvas.addEventListener('click', (event) => {
            if (!DataManager.isMapLoaded())
                return;
            const { clientX, clientY } = event;
            const { left, top } = canvas.getBoundingClientRect();
            const { x, y } = mouseToPosition(clientX - left, clientY - top);
            console.log(`Click: ${x}, ${y}`);
        });
    }
    document.readyState === 'complete' ? run() :
        document.addEventListener('readystatechange', () => (document.readyState === 'complete') && run());
})();
function SceneGlossary() {
    if (!window.Scene_Glossary) {
        return (<>
            Scene Glossary plugin not found.
        </>);
    }
    return (<div>
            <h1>SceneGlossary</h1>
            <button onClick={() => $gameParty.gainGlossaryAll()}>GLOSSARY_GAIN_ALL</button>
            <button onClick={() => $gameParty.loseGlossaryAll()}>GLOSSARY_LOSE_ALL</button>
        </div>);
}
function TorigoyaComponent() {
    return (<></>);
}
var TorigoyaTools;
(function (TorigoyaTools) {
    let MZ_Achievement2;
    (function (MZ_Achievement2) {
        function data() {
            if (!Torigoya.Achievement2.Manager) {
                throw new Error('TorigoyaMZ_Achievement2 is not found');
            }
        }
        MZ_Achievement2.data = data;
    })(MZ_Achievement2 = TorigoyaTools.MZ_Achievement2 || (TorigoyaTools.MZ_Achievement2 = {}));
})(TorigoyaTools || (TorigoyaTools = {}));
//# sourceMappingURL=index.jsx.map