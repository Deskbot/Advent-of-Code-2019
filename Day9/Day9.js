const fs = require("fs");
const { Program } = require("../IntCode");

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

// const program2 = "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99".split(",")
//     .map(str => parseInt(str))

const p = new Program(program);

p.input(1);

const result = p.runUntilOutput();

console.log(result);