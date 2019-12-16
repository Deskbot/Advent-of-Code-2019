class MemoTwo {
    constructor() {
        this.grid = new Map();
    }

    put(x, y, value) {
        if (!this.grid.has(y)) {
            this.grid.set(y, new Map());
        }

        this.grid.get(y).set(x, value);
    }

    get(x, y) {
        const row = this.grid.get(y);
        if (row === undefined) return undefined;
        return row.get(x);
    }

    get size() {
        let tot = 0;
        for (const row of this.grid.keys()) {
            tot += this.grid.get(row).size;
        }
        return tot;
    }
}

module.exports = {
    MemoTwo,
};
