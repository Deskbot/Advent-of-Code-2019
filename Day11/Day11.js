const bmpjs = require("bmp-js");
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

    // const poop = cells.reduce((uniqueCells, nextCell) => {
    //     const index = uniqueCells.findIndex(
    //         uniqueCell => eq(uniqueCell.pos, nextCell.pos)
    //     );
    //     if (index !== -1) {
    //         return uniqueCells.push(nextCell);
    //     }

    //     return uniqueCells;
    // }, []);

    // console.log(poop, poop.length);
}

function makeImage(finalImage, width, height) {
    finalImage = finalImage.map((pixel) => {
        switch (pixel) {
            case 0: return 0x00000000;
            case 1: return 0x00FFFFFF;
        }
        return 0xFF000000;
    });

    const data = Buffer.alloc(layers.length * pixelsInLayer * 32);

    let offset = 0;
    for (const pixel of finalImage) {
        offset = data.writeUInt32BE(pixel, offset);
    }

    const bmp = bmpjs.encode({
        data,
        width,
        height,
    });

    fs.writeFileSync("output.bmp", bmp.data);
}