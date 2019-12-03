const fs = require("fs");

const file = fs.readFileSync("input.txt").toString();

const wireSpecs = file.split("\n")
    .filter(line => line !== "");

const wire1 = wireSpecs[0].split(",");
const wire2 = wireSpecs[1].split(",");

const wire1Coords = getCoords(wire1);
const wire2Coords = getCoords(wire2);

// wire1Coords intersection wire2Coords
const overlappingCoords = intersection(wire1Coords, wire2Coords, eq);

// sort intersections by manhattan distance from origin
const sortedOverlaps = overlappingCoords.sort(([x1, y1], [x2, y2]) => {
    return (Math.abs(x1) + Math.abs(y1)) - (Math.abs(x2) + Math.abs(y2));
});

// get smallest coord
console.log(sortedOverlaps);
const closestOverlapToOrigin = sortedOverlaps[0];

// output its manhattan distance from the origin
const [x, y] = closestOverlapToOrigin;
console.log(Math.abs(x) + Math.abs(y));

function getCoords(wire) {
    const coords = [];
    let x = 0;
    let y = 0;

    for (const move of wire) {
        const dir = move[0];
        const dist = parseInt(move.substr(1));

        // 1 to dist inclusive
        for (let stepsToDist = 1; stepsToDist <= dist; stepsToDist++) {
            if (dir === "R") {
                x++;
            } else if (dir === "L") {
                x--;
            } else if (dir === "U") {
                y++;
            } else if (dir === "D") {
                y--;
            } else {
                throw new Error();
            }

            coords.push([x, y]);
        }
    }

    return coords;
}

function intersection(list1, list2, eq) {
    const intersections = [];

    for (const elem1 of list1) {
        for (const elem2 of list2) {
            if (eq(elem1, elem2)) {
                intersections.push(elem1);
            }
        }
    }

    return intersections;
}

function eq([x1, y1], [x2, y2]) {
    return x1 === x2 && y1 === y2;
}
