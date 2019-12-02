const fs = require("fs");

const file = fs.readFileSync("input.txt").toString();

function moduleToFuel(mass) {
    const fuel = Math.floor(mass / 3) - 2;

    if (fuel <= 0) return 0;

    return fuel + moduleToFuel(fuel);
}

const moduleMasses = file.split("\n")
    .filter(line => line.trim() !== "")
    .map(line => parseInt(line));

const fuelForAllModules = moduleMasses.map(moduleToFuel)
    .reduce((tot, next) => tot + next);

console.log(fuelForAllModules);
