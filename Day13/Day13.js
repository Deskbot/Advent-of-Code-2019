const fs = require("fs");
const { Program } = require("./IntCode");
const { Grid } = require("./Grid");
const readline = require('readline');

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

// part1();
part2();

function part1() {
    const game = new Program(code);
    const runner = game.run();
    const screen = new Grid();
    let steps = 0;

    function step() {
        const { value: x, done } = runner.next();
        if (done) return "stop";
        const { value: y } = runner.next();
        const { value: id } = runner.next();

        steps++;
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
        console.log(steps);
    }, 1);
}


function part2() {
    const game = new Program(code);
    const runner = game.run();
    const screen = new Grid();
    let score = 0;

    game.state.set(2);

    // skip the setup
    for (let i = 1; i <= 896; i++) {
        step(runner);
    }

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on("keypress", (ch, key) => {
        let move = ch === "a" ? -1
            : ch === "d" ? 1
            : 0;

        game.input(move);
        step(runner)
        console.log(screen.toString());
        console.log(score);
    });


    function step(runner) {
        const { value: x, done } = runner.next();
        if (done) return "done";
        const { value: y } = runner.next();
        const { value: id } = runner.next();

        if (x === -1 && y === 0) {
            return id;
        } else {
            screen.put(x, y, idToChar[id]);
        }
    }
}
