import React from 'react';
import ReactDOM from 'react-dom/client';

interface EventViewerProps {
}

export function EventViewer(props: EventViewerProps): JSX.Element {
    return (
        <div>
        <h1>Event Viewer</h1>
        </div>
    );
}

function run() {
    const domContainer = document.createElement('div');
    domContainer.id = 'coordinate-display';
    document.body.appendChild(domContainer);

    const root = ReactDOM.createRoot(domContainer);
    root.render(React.createElement(EventViewer));

    console.log('EventViewer loaded.');
}

document.readyState === 'complete' ? run() :
    document.addEventListener('readystatechange', () => (document.readyState === 'complete') && run());