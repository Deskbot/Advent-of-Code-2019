const fs = require("fs");

class Line {
    constructor([x1,y1], [x2,y2]) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    get angle() {
        return Math.atan((this.x1 - this.x2) / (this.y1 - this.y2)); // angle from x direction anti-clockwise
    }
}

main();

function main() {
    const file = fs.readFileSync("input.txt").toString();
    const grid = file.split("\n")
        .filter(line => line !== "")
        .map(line => line.split(""));

    const asteroids = [];
    for (const [x, row] of grid.entries()) {
        for (const [y, content] of row.entries()) {
            if (content === "#") {
                asteroids.push([x, y]);
            }
        }
    }

    // compare angle of each asteroid to all the others
    // count unique angles
    let bestAsteroid;
    let mostAngles = -Infinity;
    for (const candidateAsteroid of asteroids) {
        const angles = new Set();
        for (const otherAsteroid of asteroids) {
            if (candidateAsteroid === otherAsteroid) continue;

            const { angle } = new Line(candidateAsteroid, otherAsteroid);
            angles.add(angle);
        }

        if (angles.size > mostAngles) {
            mostAngles = angles.size;
            bestAsteroid = candidateAsteroid;
        }
    }

    console.log(bestAsteroid, mostAngles);
}
