const fs = require("fs");
const { Program } = require("./IntCode");

const file = fs.readFileSync("input.txt").toString();
const program = file.split(",")
    .filter(line => line !== "")
    .map(str => parseInt(str));

program.forEach(int => {
    if (int > Number.MAX_SAFE_INTEGER || int < Number.MIN_SAFE_INTEGER) {
        console.log("Houston, we have a problem.");
    }
    if (typeof int !== "number") {
        console.log("Houston, we have a problem.");
    }
})

const p1 = new Program(program);
p1.input(1);
const p2 = new Program(program);
p2.input(2);

console.log(...p1.run());
console.log(...p2.run());
