const fs = require("fs");
const { OneToManyMap } = require("../OneToManyMap");
const { infiniteSauce } = require("../util");

class Line {
    constructor([x1,y1], [x2,y2]) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    // think about how the atan output would relate to the actual
    // from north clockwise
    // could have translated the points 90° anti-clockwise
    // then used regular atan
    get angle() {
        const xIsNeg = this.xLen < 0;
        const yIsNeg = this.yLen < 0;
        const xIsPos = !xIsNeg;
        const yIsPos = !yIsNeg;

        let sign, rotate;

        if (xIsPos && yIsPos) {
            sign = -1;
            rotate = Math.PI / 2;
        }

        else if (xIsPos && yIsNeg) {
            sign = -1;
            rotate = Math.PI / 2;
        }

        else if (xIsNeg && yIsNeg) {
            sign = 1;
            rotate = 3 * Math.PI / 2;
        }

        else {
            sign = 1;
            rotate = 3 * Math.PI / 2;
        }

        return (Math.atan(this.yLen / this.xLen)
            * sign
            + rotate
            + 2 * Math.PI
        ) % (2 * Math.PI);
    }

    get xLen() {
        return this.x2 - this.x1;
    }

    get yLen() {
        return this.y2 - this.y1;
    }
}

const file = fs.readFileSync("input.txt").toString();
const grid = file.split("\n")
    .filter(line => line !== "")
    .map(line => line.split(""));

const asteroids = [];
for (const [y, row] of grid.entries()) {
    for (const [x, content] of row.entries()) {
        if (content === "#") {
            asteroids.push([x, y]);
        }
    }
}

const [baseAsteroid, mostAngles] = part1();

console.log(baseAsteroid, mostAngles);

const orderOfDestruction = part2(baseAsteroid);
console.log(orderOfDestruction[199], orderOfDestruction);

fs.writeFileSync("test.txt", orderOfDestruction
    .map(([x,y],i)=>`${i.toString().padStart(4)}: ${x},${y}`)
    .join("\n")
);

function distance([x1,y1], [x2,y2]) {
    return Math.sqrt(
        Math.pow(x1-x2, 2)
        +
        Math.pow(y1-y2, 2)
    );
}

function part1() {
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

    return [bestAsteroid, mostAngles];
}

function part2(baseAsteroid) {
    const otherAsteroids = asteroids.filter(a => a !== baseAsteroid);
    if (otherAsteroids.length != asteroids.length - 1) throw "Houston";

    // closest to furthest
    otherAsteroids.sort((a1,a2) => {
        return distance(baseAsteroid, a1) - distance(baseAsteroid, a2);
    });

    // angles to a list of asteroid at that angle
    const m = new OneToManyMap();
    for (const asteroid of otherAsteroids) {
        const { angle } = new Line(baseAsteroid, asteroid);
        m.set(angle, asteroid);
    }

    let removed = 0;
    const orderOfDestruction = [];
    const map = m.toMap();
    for (const angle of infiniteSauce([...map.keys()].sort())) {
        const asteroids = m.getAll(angle);

        if (asteroids.length === 0) continue;

        orderOfDestruction.push(asteroids.shift()); // take front asteroid (closest)
        removed++;

        if (removed === otherAsteroids.length) {
            break;
        }
    }

    return orderOfDestruction;
}
