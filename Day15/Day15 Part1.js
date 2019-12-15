const fs = require("fs");
const readline = require('readline');
const { Program } = require("../IntCode");
const { World } = require("./World");

const oppositeDir = {
    1: 2,
    2: 1,
    3: 4,
    4: 3,
}

const leftOf = {
    1: 3,
    2: 4,
    3: 2,
    4: 1,
}

const rightOf = {
    1: 4,
    2: 3,
    3: 1,
    4: 2,
}

const code = fs.readFileSync("input.txt").toString()
    .split(",")
    .filter(num => num !== "")
    .map(num => parseInt(num));

const game = new Program(code);
const runner = game.run();

const world = new World();
const moves = [];
let moveDir = 1;
let count = 0;

while (true) {
    count++;
    console.log(world.grid.toString());
    console.log(moves.length)

    game.input(moveDir);

    const status = step(runner, moveDir);

    if (status === 2 || status === true) break;

    if (status === 0) {
        moveDir = rightOf[moveDir];
    } else {
        moveDir = leftOf[moveDir];
    }
}

console.log(world.grid.toString());
console.log(moves);
console.log(moves.length + 1) // dunno why I need to add 1, tried it and it was right

function step(runner, dir) {
    const { value: status, done } = runner.next();

    if (done) return true;

    if (status === 0) {
        if (dir === 1) {
            world.wallNorth();
        } else if (dir === 2) {
            world.wallSouth();
        } else if (dir === 3) {
            world.wallWest();
        } else { // 4
            world.wallEast();
        }
    } else if (status === 1) {
        if (dir === 1) {
            world.moveNorth();
        } else if (dir === 2) {
            world.moveSouth();
        } else if (dir === 3) {
            world.moveWest();
        } else { // 4
            world.moveEast();
        }

        if (dir === oppositeDir[moves[moves.length - 1]]) {
            moves.pop();
        } else {
            moves.push(dir);
        }
    }

    return status;
}