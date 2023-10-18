HTMLElement.prototype.setup = function (key, value) {
    return (this.setAttribute(key, value), this);
}
document.body.appendChild(document.createElement('script'))
    .src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
document.body.appendChild(document.createElement('script'))
    .src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js';

DataManager.isThisGameFile = function (savefileId) {
    var globalInfo = this.loadGlobalInfo();
    if (globalInfo && globalInfo[savefileId]) {
        if (StorageManager.isLocalMode()) {
            return true;
        } else {
            var savefile = globalInfo[savefileId];
            return (savefile);
        }
    } else {
        return false;
    }
};

const loadLocalSaveFile = (url) => new Promise((resolve, reject) => {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function () {
            if (xhr.status < 400) {
                resolve(xhr.responseText);
            } else {
                reject(new Error('Network error.'));
            }
        };
        xhr.onerror = this._mapLoader || function () {
            DataManager._errorUrl = DataManager._errorUrl || url;
        };
        xhr.send();
        setTimeout(() => {
            xhr.abort();
            reject(new Error('Network timeout.'));
        }, 10000);
    } catch (e) {
        reject(e);
    }
});

class Dropdown {
    menus = [];
    constructor(menus) {
        this.menus = menus.map(x => ({
            ...x,
            id: this._randomId()
        }));
        for (const menu of this.menus) {
            window["_cb_" + menu.id] = menu.callback;
        }
    }

    _randomId() {
        return Math.random().toString(36).substr(2, 9);
    }

    _optionHtml(option) {
        return /*html*/`
<li class="option" id="${option.id}" onclick="_cb_${option.id}()">
    <i class="bx ${option.icon}" style="color: ${option.color};"></i>
    <span class="option-text">${option.text}</span>
</li>
        `;
    }

    get style() {
        return /*html*/`
        <style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&display=swap');
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}
.select-menu{
    position: fixed;
    top: 0;
    left: 0;
    transform: scale(0.5);
    transform-origin: top left;
    cursor: pointer;
    z-index: 9999;
}
.select-menu .select-btn{
    display: flex;
    height: 55px;
    background: #fff;
    padding: 20px;
    font-size: 18px;
    font-weight: 400;
    border-radius: 8px;
    align-items: center;
    cursor: pointer;
    justify-content: space-between;
    box-shadow: 0 0 5px rgba(0,0,0,0.1);
}
.select-btn i{
    font-size: 25px;
    transition: 0.3s;
}
.select-menu.active .select-btn i{
    transform: rotate(-180deg);
}
.select-menu .options{
    position: relative;
    padding: 8px;
    margin-top: 10px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 0 3px rgba(0,0,0,0.1);
    display: none;
}
.select-menu.active .options{
    display: block;
}
.options .option{
    display: flex;
    cursor: pointer;
    padding: 4px 16px;
    border-radius: 8px;
    align-items: center;
    background: #fff;
}
.options .option:hover{
    background: #F2F2F2;
}
.option i{
    font-size: 25px;
    margin-right: 12px;
}
.option .option-text{
    font-size: 18px;
    color: #333;
}
</style>
        `;
    }

    get html() {
        return /*html*/`
<link href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css' rel='stylesheet'>
${this.style}
<div class="select-menu">
    <div class="select-btn">
        <span class="sBtn-text">LocalSave</span>
        <i class="bx bx-chevron-down"></i>
    </div>
    <ul class="options">
        ${this.menus.map(x => this._optionHtml(x)).join('')}
    </ul>
</div>
        `;
    }

    get script() {
        return `
const optionMenu = document.querySelector(".select-menu"),
       selectBtn = optionMenu.querySelector(".select-btn");
selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));
        `;
    }
}


async function importLocalSaveFile(savefileId) {
    try {
        localStorage.setItem(
            StorageManager.webStorageKey(savefileId),
            await loadLocalSaveFile(
                StorageManager.localFilePath(savefileId)
            )
        );
        return true;
    } catch (e) {
        return false;
    }
}

function load() {
    if (!StorageManager.isLocalMode())
        StorageManager.localFileDirectoryPath = () => "save/";
    (async () => {
        const result = [];
        for (let i = -1; i < 20; i++) {
            result.push(await importLocalSaveFile(i));
        }
        window.location.reload();
    })();
}

function downloadSave() {
    if (!StorageManager.isLocalMode())
        StorageManager.localFileDirectoryPath = () => "save/";
    const zip = new JSZip();
    for (let i = -1; i < 20; i++) {
        if (localStorage.getItem(StorageManager.webStorageKey(i))) {
            zip.file(
                StorageManager.localFilePath(i),
                localStorage.getItem(StorageManager.webStorageKey(i))
            );
        }
    }
    zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "LocalSave.zip");
    });
}

function edit(savefileId) {
    document.querySelector('#jsoneditor #close').addEventListener('click', () => {
        StorageManager.save(savefileId, JSON.stringify(window.jsoneditor.get()));
    });
    document.getElementById('jsoneditor').style.display = 'block';
    window.jsoneditor.set(
        JSON.parse(StorageManager.load(savefileId))
    );
}

window.addEventListener('load', function () {
    if (StorageManager.isLocalMode()) this.alert('LocalSave plugin is not working in local mode.');
    const scriptarea = document.createElement('div');
    const dropdown = new Dropdown([{
        icon: 'bx bx-save',
        color: '#171515',
        text: 'Load',
        callback: load
    }, {
        icon: 'bx bx-download',
        color: '#171515',
        text: 'Download',
        callback: downloadSave
    }, {
        icon: 'bx bx-edit',
        color: '#171515',
        text: 'Edit Config',
        callback: () => edit(-1)
    }, {
        icon: 'bx bx-edit',
        color: '#171515',
        text: 'Edit Global Data',
        callback: () => edit(0)
    }, {
        icon: 'bx bx-reset',
        color: '#171515',
        text: 'Reset',
        callback: () => {
            if (confirm('Are you sure?')) {
                for (let i = -1; i < 20; i++) {
                    StorageManager.remove(i);
                }
                window.location.reload();
            }
        }
    }]);
    scriptarea.innerHTML += dropdown.html;
    this.document.body.appendChild(scriptarea);
    eval(dropdown.script);
    this.setInterval(() => {
        this.document.querySelector('.select-menu').style.display = DataManager.isMapLoaded() && Object.getOwnPropertyNames($dataMap).length ? 'none' : 'block';
    }, 1000);
});