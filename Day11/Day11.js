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

class Robot {
    constructor() {
        this.pos = [0,0];
        this.facing = Dir.UP;
    }

    rotLeft() {
        this.move((dirsClockwise.indexOf(this.facing) - 1) % dirsClockwise.length);
        this.pos = [this.pos[0], this.pos[1] + 1];
    }

    rotRight() {
        this.move((dirsClockwise.indexOf(this.facing) + 1) % dirsClockwise.length);
        this.pos = [this.pos[0], this.pos[1] - 1];
    }

    move(dir) {
        switch (dir) {
            case Dir.UP: return this.up();
            case Dir.DOWN: return this.down();
            case Dir.LEFT: return this.left();
            case Dir.RIGHT: return this.right();
        }
    }

    up() {
        this.pos = [this.pos[0], this.pos[1] + 1];
    }

    down() {
        this.pos = [this.pos[0], this.pos[1] - 1];
    }

    left() {
        this.pos = [this.pos[0] - 1, this.pos[1]];
    }

    right() {
        this.pos = [this.pos[0] + 1, this.pos[1]];
    }
}

part1();

function eq([x1, y1], [x2, y2]) {
    return x1 === x2 && y1 === y2;
}

function part1() {
    const cells = [];
    const brain = new Program(code);
    const robot = new Robot();

    const outputter = brain.run();

    while (true) {
        const { value: colour, done1 } = outputter.next();
        if (done1) break;
        const { value: move, done2 }  = outputter.next();
        if (done2) break;

        if (move === 0) {
            robot.rotLeft();
        } else {
            robot.rotRight();
        }

        if (colour === 1) {
            cells.push({
                pos: robot.pos,
                col: colour,
            });
        }
    }

    cells.reduce((uniqueCells, nextCell) => uniqueCells.findIndex(
        uniqueCell => eq(uniqueCell.pos, nextCell.pos)
    ), []);

    console.log(cells);
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