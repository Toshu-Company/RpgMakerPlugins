"use strict";
function drawTile(x, y, lower) {
    const tilemap = SceneManager._scene._spriteset._tilemap;
    const _tileWidth = tilemap.tileWidth;
    const _tileHeight = tilemap.tileHeight;
    var dx = (x * _tileWidth).mod(tilemap._layerWidth);
    var dy = (y * _tileHeight).mod(tilemap._layerHeight);
    var lx = dx / _tileWidth;
    var ly = dy / _tileHeight;
    const bitmap = lower ? tilemap._lowerBitmap : tilemap._upperBitmap;
    const context = bitmap.context;
    context.fillStyle = "rgba(255, 0, 0, 0.5)";
    context.fillRect(dx, dy, _tileWidth, _tileHeight);
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
    </div>);
}
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
}
document.readyState === 'complete' ? run() :
    document.addEventListener('readystatechange', () => (document.readyState === 'complete') && run());
//# sourceMappingURL=index.jsx.map