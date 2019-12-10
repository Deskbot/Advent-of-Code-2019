const fs = require("fs");

class Line {
    constructor([x1,y1], [x2,y2]) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    get angle() {
        // const xIsNeg = (this.x1 - this.x2) < 0;
        // const yIsNeg = (this.y1 - this.y2) < 0;

        // // angle above the x-axis from origin (below when negative)
        // const angle = Math.atan((this.x1 - this.x2) / (this.y1 - this.y2));

        // if (xIsNeg) {
        //     if (yIsNeg) {
        //         return Math.PI + angle;
        //     }

        //     return Math.PI - angle;
        // }

        // return angle;

        const xIsNeg = (this.x1 - this.x2) < 0;
        const yIsNeg = (this.y1 - this.y2) < 0;

        let angle = (this.x1 - this.x2) / (this.y1 - this.y2);

        if (!xIsNeg && !yIsNeg) {
            return angle;
        }

        if (xIsNeg && !yIsNeg) {
            return angle + Math.PI / 2;
        }

        if (!xIsNeg && yIsNeg) {
            return angle + 3 * Math.PI / 2;
        }

        return angle + Math.PI;
    }
}

main();

function main() {
    const file = fs.readFileSync("input.txt").toString();
    const grid = file.split("\n")
        .filter(line => line !== "")
        .map(line => line.split(""));

    const asteroids = [];
    for (const [y, col] of grid.entries()) {
        for (const [x, content] of col.entries()) {
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
