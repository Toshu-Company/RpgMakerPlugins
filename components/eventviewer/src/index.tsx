const { useState, useEffect, useCallback } = React;

function Root(): JSX.Element {
    const [visible, setVisible] = useState(false);

    const onKeyUp = useCallback((event: KeyboardEvent) => {
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyE') {
            setVisible((visible) => !visible);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keyup', onKeyUp);
        return () => document.removeEventListener('keyup', onKeyUp);
    }, []);

    return (
        <div style={{ display: visible ? 'block' : 'none' }}>
            <h1>Event Viewer</h1>
            <SceneGlossary />
        </div>
    );
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
            if (!DataManager.isMapLoaded()) return;
            const { clientX, clientY } = event;
            const { left, top } = canvas.getBoundingClientRect();
            const { x, y } = mouseToPosition(clientX - left, clientY - top);
            console.log(`Click: ${x}, ${y}`);
        });
    }

    document.readyState === 'complete' ? run() :
        document.addEventListener('readystatechange', () => (document.readyState === 'complete') && run());
})();