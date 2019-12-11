const fs = require("fs");
const { Program } = require("./IntCode");

const file = fs.readFileSync("input.txt").toString();
const code = file.split(",")
    .filter(line => line !== "")
    .map(str => parseInt(str));

const Dir = {
    UP: Symbol("UP"),
    DOWN: Symbol("DOWN"),
    LEFT: Symbol("LEFT"),
    RIGHT: Symbol("RIGHT"),
};
const dirsClockwise = [Dir.UP, Dir.LEFT, Dir.DOWN, Dir.RIGHT];

class Grid {
    constructor() {
        this.grid = new Map();
    }

    put(x, y, colour) {
        if (!this.grid.has(x)) {
            this.grid.set(x, new Map());
        }

        this.grid.get(x).set(y, colour);
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
}

class Robot {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.facing = Dir.UP;
    }

    rotLeft() {
        const dirIndex = (dirsClockwise.indexOf(this.facing)
            - 1
            + dirsClockwise.length
        ) % dirsClockwise.length;

        this.move(dirsClockwise[dirIndex]);
    }

    rotRight() {
        const dirIndex = (dirsClockwise.indexOf(this.facing)
            + 1
            + dirsClockwise.length
        ) % dirsClockwise.length;

        this.move(dirsClockwise[dirIndex]);
    }

    move(dir) {
        this.facing = dir;
        switch (dir) {
            case Dir.UP: return this.up();
            case Dir.DOWN: return this.down();
            case Dir.LEFT: return this.left();
            case Dir.RIGHT: return this.right();
        }
    }

    up() {
        this.y++;
    }

    down() {
        this.y--;
    }

    left() {
        this.x--;
    }

    right() {
        this.x++;
    }
}

part1();
part2();

function lowHigh(a, b) {
    return a - b;
}

function part1() {
    const grid = new Grid();
    const brain = new Program(code);
    const robot = new Robot();

    const outputter = brain.run();

    while (true) {
        const { value: colour, done: done1 } = outputter.next();
        if (done1) break;
        const { value: move, done: done2 } = outputter.next();
        if (done2) break;

        grid.put(robot.x, robot.y, colour);

        if (move === 0) {
            robot.rotLeft();
        } else {
            robot.rotRight();
        }

        brain.input(grid.get(robot.x, robot.y));
    }

    console.log(grid.size);
}

function part2() {
    const grid = new Grid();
    const brain = new Program(code);
    const robot = new Robot();

    grid.put(0, 0, 1); // the starting pos is white
    const outputter = brain.run();

    while (true) {
        const { value: colour, done: done1 } = outputter.next();
        if (done1) break;
        const { value: move, done: done2 } = outputter.next();
        if (done2) break;

        grid.put(robot.x, robot.y, colour);

        if (move === 0) {
            robot.rotLeft();
        } else {
            robot.rotRight();
        }

        brain.input(grid.get(robot.x, robot.y));
    }

    const { minX, minY } = grid;
    let yOffset = minY < 0 ? Math.abs(minY) : 0;
    const imageData = [];
    for (const x of [...grid.grid.keys()].sort(lowHigh)) {
        const ys = []
        for (const y of grid.grid.get(x).keys()) {
            ys[y + yOffset] = grid.grid.get(x).get(y) === 0 ? " " : "█";
        }
        imageData.push(ys.map(cell => cell === undefined ? " " : cell)
            .reduce((str, char) => str + char), ""); // join totally doesn't work as advertised
    }

    console.log(imageData);
}
