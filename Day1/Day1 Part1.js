const fs = require("fs");

const file = fs.readFileSync("input.txt").toString();

const masses = file.split("\n")
    .filter(line => line.trim() !== "")
    .map(line => parseInt(line));
const totalFuel = masses.map(mass => Math.floor(mass / 3) - 2)
    .reduce((tot, next) => tot + next);

console.log(totalFuel);
