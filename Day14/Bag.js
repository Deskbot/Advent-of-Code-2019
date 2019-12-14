class Bag {
    constructor() {
        this.map = new Map();
    }

    add(key, val) {
        const existingVal = this.map.get(key);
        if (existingVal) {
            this.map.set(key, existingVal + val)
        } else {
            this.map.set(key, val);
        }
    }

    get(key) {
        const val = this.map.get(key);
        if (val === undefined) return 0;
        return val;
    }
}

module.exports = {
    Bag,
}