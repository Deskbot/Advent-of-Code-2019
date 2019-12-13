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

part1();

function part1() {
    const game = new Program(code);
    const runner = game.run();
    const screen = new Grid();

    function step() {
        const { value: x, done } = runner.next();
        if (done) return "stop";
        const { value: y } = runner.next();
        const { value: id } = runner.next();

        screen.put(x, y, idToChar[id]);
    }

    const i = setInterval(() => {
        if (step()) {
            clearInterval(i);
            const finalScreen = screen.toString();
            console.log(finalScreen);
            console.log(finalScreen.match(/B/g).length);
        }

        console.log(screen.toString());
    }, 1);

}
