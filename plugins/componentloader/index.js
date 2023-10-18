HTMLElement.prototype.setup = function (key, value) {
    return (this.setAttribute(key, value), this);
}
document.head.appendChild(document.createElement('script'))
    .src = 'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.development.min.js';
document.head.appendChild(document.createElement('script'))
    .src = 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.development.min.js';
document.head.appendChild(document.createElement('script'))
    .setup('src', 'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js')
    .addEventListener('load', () => Babel.transformScriptTags());

var parameters = PluginManager.parameters('ComponentLoader');
var list = parameters['list'];

for (const component of list) {
    const ext = component.split('.').pop();
    if (['css'].includes(ext)) {
        document.head.appendChild(
            document.createElement('link')
                .setup('rel', 'stylesheet')
                .setup('href', `js/components/${component}`)
        );
    }
    if (['js', 'jsx'].includes(ext)) {
        document.body.appendChild(
            document.createElement('script')
                .setup('type', component.endsWith(".jsx") ? 'text/babel' : 'text/javascript')
                .setup('src', `js/components/${component}`)
        );
    }
}