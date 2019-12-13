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

function part2() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const game = new Program(code);
    const runner = game.run();
    const screen = new Grid();
    let score = 0;

    game.state[0] = 2;

    play();

    async function play() {
        while (true) {
            try {
                const s = await stepWithInput();
                score = s;
            } catch (e) {
                break;
            }
        }

        console.log(score);
    }


    function stepWithInput() {
        return new Promise((resolve, reject) => {
            rl.question(screen.toString(), (move) => {
                const moveCode = move === "a" ? -1
                    : move === "d" ? 1
                    : 0;

                game.input(moveCode);
                if (step(game, runner)) {
                    return reject();
                }

                rl.close();
                resolve();
            });
        });
    }

    function step(game, runner) {
        game.input(joyPos);
        const { value: x, done } = runner.next();
        if (done) return "done";
        const { value: y } = runner.next();
        const { value: id } = runner.next();

        if (x === -1 && y === 0) {
            score = id;
        } else {
            screen.put(x, y, idToChar[id]);
        }
    }
}
