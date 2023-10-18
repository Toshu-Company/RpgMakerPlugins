HTMLElement.prototype.setup = function (key, value) {
    return (this.setAttribute(key, value), this);
}

document.body.appendChild(document.createElement('script'))
    .src = 'https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.10.3/jsoneditor.min.js';
document.body.appendChild(
    document.createElement('link')
        .setup('rel', 'stylesheet')
        .setup('href', 'https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.10.3/jsoneditor.min.css'));

const wrapper = document.createElement('div');
const jsoneditor = document.createElement('div');

jsoneditor.style.width = '100%';
jsoneditor.style.height = '100%';

wrapper.id = 'jsoneditor';
wrapper.style.width = '80vw';
wrapper.style.height = '80vh';
wrapper.style.position = 'fixed';
wrapper.style.top = '10vh';
wrapper.style.left = '10vw';
wrapper.style.display = 'none';
wrapper.addEventListener('click', e => e.stopPropagation());
wrapper.addEventListener('keydown', e => e.stopPropagation());

wrapper.appendChild(jsoneditor);

const close = document.createElement('button');
close.id = 'close';
close.innerText = 'Close';
close.style.top = '0';
close.style.right = '0';
close.style.zIndex = '1';
close.addEventListener('click', () => wrapper.style.display = 'none');
wrapper.appendChild(close);

document.body.appendChild(wrapper);

window.addEventListener('load', function () {
    wrapper.style.zIndex = '999';
    this.window.jsoneditor = new JSONEditor(jsoneditor, {});
});