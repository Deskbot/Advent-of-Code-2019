class Grid {
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
        if (row === undefined) return 0; // black (default)
        return row.get(x);
    }

    get size() {
        let tot = 0;
        for (const row of this.grid.keys()) {
            tot += this.grid.get(row).size;
        }
        return tot;
    }

    get minX() {
        return [...this.grid.keys()]
            .map(y => this.grid.get(y)) // list of x maps
            .map(xmap => [...xmap.keys()].sort(lowHigh)[0]) // list of minx for each y
            .sort(lowHigh)[0]; // minx
    }

    toString() {
        const { minX } = this;
        let xOffset = minX < 0 ? Math.abs(minX) : 0;
        const arr = [];
        for (const y of [...this.grid.keys()].sort(lowHigh)) {
            const xs = []
            for (const x of this.grid.get(y).keys()) {
                xs[x + xOffset] = this.grid.get(y).get(x);
            }

            let xChars = [];
            for (let [i, char] of xs.entries()) { // have to look at the indexes individually because .map distringuishes between undefined and empty list item
                xChars[i] = char === undefined ? " " : char;
            }

            arr.push(xChars.join(''));
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