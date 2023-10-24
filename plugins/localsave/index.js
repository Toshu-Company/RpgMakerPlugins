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

class SaveManager {
    static loadConfig(local = false) {

    }
    static loadGlobalInfo(local = false) {

    }
    static load(savefileId, local = false) {
    }

    static GetManager() {
        if (SaveManagerMV.available()) {
            return SaveManagerMV;
        } else if (SaveManagerMZ.available()) {
            return SaveManagerMZ;
        }
    }
}

class SaveManagerMV extends SaveManager {
    static available() {
        return Utils.RPGMAKER_NAME === 'MV';
    }
    static override() {
        if (!StorageManager.isLocalMode())
            StorageManager.localFileDirectoryPath = () => "save/";
    }
    static filePath(savefileId) {
        return StorageManager.localFilePath(savefileId);
    }
    static async encodeObject(object) {
        return LZString.compressToBase64(object);
    }
    static async load(savefileId, local = false) {
        if (local) {
            return LZString.decompressFromBase64(await loadLocalSaveFile(this.filePath(savefileId)));
        } else {
            return StorageManager.load(savefileId);
        }
    }
    static async loadExtension(local = false) {
        const result = {};
        if (typeof utakata === 'object') {
            if (local) {
                const path = StorageManager.localFilePathCommonSave();
                const data = LZString.decompressFromBase64(await loadLocalSaveFile(path));
                result.utakata = data;
            } else {
                result.utakata = StorageManager.loadCommonSave();
            }
        }
        if (typeof Torigoya === 'object') {
            const Achievement = Torigoya.Achievement ?? Torigoya.Achievement2;
            if (Achievement) {
                if (local) {
                    result.torigoya = LZString.decompressFromBase64(
                        await loadLocalSaveFile(
                            this.filePath(
                                Achievement.saveSlotID
                            )
                        )
                    );
                } else {
                    result.torigoya = StorageManager.load(
                        Achievement.saveSlotID
                    );
                }
            }
        }
        return result;
    }
    static pathExtension(key) {
        if (key === 'utakata') {
            return StorageManager.localFilePathCommonSave();
        }
    }

    static async saveExtension(data) {
        if (typeof utakata === 'object' && data.utakata) {
            StorageManager.saveCommonSave(data.utakata);
        }
        if (typeof Torigoya === 'object') {
            const Achievement = Torigoya.Achievement ?? Torigoya.Achievement2;
            if (Achievement)
                StorageManager.save(Achievement.saveSlotID, data.torigoya);
        }
    }
    static async
    static async save(savefileId, json) {
        return StorageManager.save(savefileId, json);
    }
    static async reset() {
        for (let i = -1; i < 20; i++) {
            StorageManager.remove(i);
        }
    }
}

class SaveManagerMZ extends SaveManager {
    static available() {
        return Utils.RPGMAKER_NAME === 'MZ';
    }
    static configFileName = 'config';
    static globalInfoFileName = 'global';
    static override() {
        if (!StorageManager.isLocalMode())
            StorageManager.fileDirectoryPath = () => "save/";
    }
    static async loadFromLocalFile(saveName) {
        const filePath = StorageManager.filePath(saveName);
        return await loadLocalSaveFile(filePath);
    }
    static async loadZip(saveName, local = false) {
        if (local) {
            return this.loadFromLocalFile(saveName);
        } else {
            return StorageManager.loadFromForage(saveName);
        }
    }
    static async loadObject(filename, local = false) {
        return this.loadZip(filename, local)
            .then(zip => StorageManager.zipToJson(zip))
            .then(json => StorageManager.jsonToObject(json));
        // .catch(() => null);
    }
    static async encodeObject(object) {
        return StorageManager.objectToJson(object)
            .then(json => StorageManager.jsonToZip(json));
    }
    static async loadConfig(local = false) {
        return this.loadObject(this.configFileName, local);
    }
    static async loadGlobalInfo(local = false) {
        return this.loadObject(this.globalInfoFileName, local);
    }
    static async loadSave(savefileId, local = false) {
        const saveName = DataManager.makeSavename(savefileId);
        return this.loadObject(saveName, local);
    }
    static async load(savefileId, local = false) {
        return this.loadObject(this.getName(savefileId), local);
    }
    static async loadExtension() {
    }
    static pathExtension(key) {
    }

    static async saveExtension(data) {
    }
    static async save(savefileId, json) {
        return StorageManager.saveObject(this.getName(savefileId), json);
    }
    static async reset() {
        for (let i = -1; i < 20; i++) {
            await StorageManager.remove(this.getName(i));
        }
    }
    static getName(savefileId) {
        switch (savefileId) {
            case -1:
                return this.configFileName;
            case 0:
                return this.globalInfoFileName;
            default:
                return DataManager.makeSavename(savefileId);
        }
    }
    static filePath(savefileId) {
        return StorageManager.filePath(this.getName(savefileId));
    }
}

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

function load() {
    const manager = SaveManager.GetManager();
    if (!manager) return;
    manager.override();
    (async () => {
        const result = [];
        for (let i = -1; i <= 20; i++) {
            result.push(
                await manager.load(i, true)
                    .then(manager.save.bind(manager, i))
                    .then(() => true)
                    .catch(() => false)
            );
        }
        await manager.loadExtension().then(manager.saveExtension.bind(manager)).catch(() => null);
        window.location.reload();
    })();
}

async function downloadSave() {
    const manager = SaveManager.GetManager();
    if (!manager) return;
    manager.override();

    const zip = new JSZip();

    for (let i = -1; i <= 20; i++) {
        const data = await manager.load(i);
        if (data) {
            zip.file(manager.filePath(i), await manager.encodeObject(data));
        }
    }

    const extension = await manager.loadExtension();
    for (const key in extension) {
        zip.file(manager.pathExtension(key), await manager.encodeObject(extension[key]));
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
                SaveManager.GetManager()?.reset().then(() => window.location.reload());
            }
        }
    }]);
    scriptarea.innerHTML += dropdown.html;
    this.document.body.appendChild(scriptarea);
    eval(dropdown.script);
    this.setInterval(() => {
        // this.document.querySelector('.select-menu').style.display = DataManager.isMapLoaded() && Object.getOwnPropertyNames($dataMap).length ? 'none' : 'block';
    }, 1000);
});