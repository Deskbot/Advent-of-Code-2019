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
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const game = new Program(code);
    const runner = game.run();
    const screen = new Grid();

    game.state[0] = 2;

    play();

    async function play() {
        let stepNumber = 0;
        let score = 0;

        while (true) {
            try {
                const result = await stepWithInput(stepNumber);
                if (result !== undefined) {
                    score = result;
                }
                stepNumber++;
            } catch (e) {
                break;
            }
        }

        console.log(score);
    }


    function stepWithInput(stepNumber) {
        return new Promise((resolve, reject) => {
            if (stepNumber < 836) {
                return resolve();
            }

            rl.question(screen.toString(), (move) => {
                const moveCode = move === "a" ? -1
                    : move === "d" ? 1
                    : 0;

                game.input(moveCode);
                const result = step(runner);
                if (result === "done") {
                    return reject();
                }

                rl.close();
                resolve(result);
            });
        });
    }

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
