(function () {
    if (new URL(location.href).host !== 'games.toshu.me') return;
    const pathname = location.pathname.match(/\/[^\/]*\//)[0].replace(/^\//, '').replace(/\/$/, '').replace(/\/[^\/]*\.[^\/]*$/, '');

    const { getItem, setItem, removeItem } = localStorage;

    localStorage.getItem = function (key) {
        return getItem.call(this, `${pathname}:${key}`);
    };

    localStorage.setItem = function (key, value) {
        setItem.call(this, `${pathname}:${key}`, value);
    }

    localStorage.removeItem = function (key) {
        removeItem.call(this, `${pathname}:${key}`);
    }

    localStorage.clear = function () {
        for (let key in this) {
            if (key.startsWith(`${pathname}:`)) {
                this.removeItem(key);
            }
        }
    }

    localStorage.key = function (index) {
        let i = 0;
        for (let key in this) {
            if (key.startsWith(`${pathname}:`)) {
                if (i === index) {
                    return key.replace(`${pathname}:`, '');
                }
                i++;
            }
        }
    }

    localStorage.length = function () {
        let i = 0;
        for (let key in this) {
            if (key.startsWith(`${pathname}:`)) {
                i++;
            }
        }
        return i;
    }
})();