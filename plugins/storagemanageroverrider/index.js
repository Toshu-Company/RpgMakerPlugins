(function () {
    if (new URL(location.href).host !== 'games.toshu.me') return;
    const pathname = location.pathname.match(/\/[^\/]*\//)[0].replace(/^\//, '').replace(/\/$/, '').replace(/\/[^\/]*\.[^\/]*$/, '');
    StorageManager.webStorageKey = function (savefileId) {
        if (savefileId < 0) {
            return `${pathname}:RPG Config`;
        } else if (savefileId === 0) {
            return `${pathname}:RPG Global`;
        } else {
            return `${pathname}:RPG File${savefileId}`;
        }
    };
})();