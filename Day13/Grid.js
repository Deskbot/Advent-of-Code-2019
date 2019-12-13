class Grid {
    constructor() {
        this.grid = new Map();
    }

    put(x, y, value) {
        if (!this.grid.has(x)) {
            this.grid.set(x, new Map());
        }

        this.grid.get(x).set(y, value);
    }

    get(x, y) {
        const row = this.grid.get(x);
        if (row === undefined) return 0; // black (default)
        return row.get(y);
    }

    get size() {
        let tot = 0;
        for (const row of this.grid.keys()) {
            tot += this.grid.get(row).size;
        }
        return tot;
    }

    get minX() {
        return [...this.grid.keys()].sort()[0];
    }

    get minY() {
        return [...this.grid.keys()]
            .map(x => this.grid.get(x)) // list of y maps
            .map(ymap => [...ymap.keys()].sort(lowHigh)[0]) // list of minys
            .sort(lowHigh)[0]; // miny
    }

    toString() {
        const { minY } = this;
        let yOffset = minY < 0 ? Math.abs(minY) : 0;
        const arr = [];
        for (const x of [...this.grid.keys()].sort(lowHigh)) {
            const ys = []
            for (const y of this.grid.get(x).keys()) {
                ys[y + yOffset] = this.grid.get(x).get(y);
            }

            let yChars = [];
            for (let [i, char] of ys.entries()) { // have to look at the indexes individually because .map distringuishes between undefined and empty list item
                yChars[i] = char === undefined ? " " : char;
            }

            arr.push(yChars.join(''));
        }

        return arr.join("\n");
    }
}

function lowHigh(a, b) {
    return a - b;
}

module.exports = {
    Grid,
};