class Bag {
    constructor(map) {
        this.map = map ? map : new Map();
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

    clone() {
        return new Bag(new Map(this.map.entries()));
    }
}

module.exports = {
    Bag,
}