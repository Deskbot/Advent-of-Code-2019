const fs = require("fs");
const { Program } = require("./IntCode");
const { Grid } = require("./Grid");

const file = fs.readFileSync("input.txt").toString();
const code = file.split(",")
    .filter(line => line !== "")
    .map(str => parseInt(str));

const idToChar = {
    0: " ",
    1: "W",
    2: "B",
    3: "_",
    4: "O",
};

const game = new Program(code);
const runner = game.run();
const screen = new Grid();

while (true) {
    const { value: x } = runner.next();
    const { value: y } = runner.next();
    const { value: id, done } = runner.next();

    if (done) break;

    screen.put(x, y, idToChar[id]);
}

console.log(screen.toString());