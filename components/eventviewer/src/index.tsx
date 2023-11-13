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
        <div style={{display: visible ? 'block' : 'none'}}>
            <h1>Event Viewer</h1>
        </div>
    );
}

function run() {
    const domContainer = document.createElement('div');
    domContainer.id = 'eventviewer';
    document.body.appendChild(domContainer);

    const root = ReactDOM.createRoot(domContainer);
    root.render(React.createElement(Root));

    console.log('EventViewer loaded.');
}

document.readyState === 'complete' ? run() :
    document.addEventListener('readystatechange', () => (document.readyState === 'complete') && run());