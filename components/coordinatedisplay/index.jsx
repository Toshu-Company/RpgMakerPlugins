const { useState, useEffect } = React;

function CoordinateDisplay() {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    useEffect(() => {
        setInterval(() => {
            if (!window.$gamePlayer) return;
            setX(window.$gamePlayer.x ?? 0);
            setY(window.$gamePlayer.y ?? 0);
        }, 100);
    }, []);

    return (
        <>
            <p>{x}, {y}</p>
        </>
    );
}

function run() {
    const domContainer = document.createElement('div');
    domContainer.id = 'coordinate-display';
    document.body.appendChild(domContainer);

    const root = ReactDOM.createRoot(domContainer);
    root.render(React.createElement(CoordinateDisplay));

    console.log('CoordinateDisplay loaded.');
}

document.readyState === 'complete' ? run() :
    document.addEventListener('readystatechange', () => (document.readyState === 'complete') && run());