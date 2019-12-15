const fs = require("fs");
const readline = require('readline');
const { Program } = require("../IntCode");
const { World } = require("./World");

const keyToDir = {
    w: 1,
    s: 2,
    a: 3,
    d: 4,
};

const code = fs.readFileSync("input.txt").toString()
    .split(",")
    .filter(num => num !== "")
    .map(num => parseInt(num));

const game = new Program(code);
const runner = game.run();

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on("keypress", (ch, key) => {
    if (key.name === "c" && key.ctrl) process.kill(process.pid, "SIGINT");

    let move = keyToDir[ch];
    game.input(move);
    const done = step(runner, move);
    console.log(world.grid.toString());
});

const world = new World();
function step(runner, dir) {
    const { value: status, done } = runner.next();

    console.log(status, dir);

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
    } else {
        return true;
    }
}