class OneToManyMap {

    constructor(MapMaker) {
        this.map = MapMaker ? new MapMaker() : new Map();
    }

    clear() {
        this.map.clear();
    }

    delete(k, v ) {
        const mapsTo = this.map.get(k);

        if (mapsTo) {
            return mapsTo.delete(v);
        }

        return false;
    }

    getAll(k) {
        return this.map.get(k);
    }

    has(k, v) {
        const mapsTo = this.getAll(k);

        if (mapsTo) {
            return mapsTo.has(v);
        }

        return false;
    }

    set(k, v) {
        const mappedTo = this.map.get(k);

        if (mappedTo) {
            mappedTo.push(v);
        } else {
            this.map.set(k, [v]);
        }

        return this;
    }

    /**
     * A key can be paired with an empty set.
     * If the given key is not already in this map, create a mapping from the given key to an empty set.
     * @param k The key to add to the keyset if it doesn't already exist.
     */
    setKey(k) {
        if (!this.map.has(k)) {
            this.map.set(k, []);
        }
    }

    toMap() {
        return this.map;
    }
}

module.exports = {
    OneToManyMap
}