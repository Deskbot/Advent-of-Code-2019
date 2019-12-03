const fs = require("fs");

const file = fs.readFileSync("input.txt").toString();

const wireSpecs = file.split("\n")
    .filter(line => line !== "");

const wire1 = wireSpecs[0].split(",");
const wire2 = wireSpecs[1].split(",");

const wire1Coords = coordsTakenByWire(wire1);
const wire2Coords = coordsTakenByWire(wire2);

const overlappingCoords = intersection(wire1Coords, wire2Coords, eq);

// by manhattan distance from small to large
const sortedOverlaps = overlappingCoords.sort(([x1,y1], [x2,y2]) => {
    return x1 + y1 < x2 + y2;
});

console.log(sortedOverlaps[0]);

function coordsTakenByWire(wire) {
    let x = 0;
    let y = 0;

    const coords = [];

    for (const move of wire) {
        const dir = move[0];
        const dist = parseInt(move.substr(1));

        switch (dir) {
            case "L": x -= dist;
            break;
            case "R": x += dist;
            break;
            case "U": y += dist;
            break;
            case "D": y -= dist;
            break;
        }

        coords.push([x,y]);
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
