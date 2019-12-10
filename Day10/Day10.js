const fs = require("fs");

const file = fs.readFileSync("input.txt").toString();
const grid = file.split("\n")
    .filter(line => line !== "")
    .map(line => line.split(""));

const asteroids = [];
for (const [x, row] of grid.entries()) {
    for (const [y, content] of row.entries()) {
        if (content === "#") {
            asteroids.push([x,y]);
        }
    }
}

console.log(asteroids)