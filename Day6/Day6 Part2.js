const fs = require("fs");
const { Digraph } = require("../Digraph");

const file = fs.readFileSync("input.txt").toString();

const orbits = file.split("\n")
    .filter(line => line !== "");

const bodies = new Set(
    orbits
        .map(orbit => orbit.split(")"))
        .flat()
);

// build graph

const directOrbitGraph = new Digraph();

bodies.forEach(body => directOrbitGraph.addNode(body))

for (const orbit of orbits) {
    const [nom, acc] = orbit.split(")");
    directOrbitGraph.addEdge(nom, acc);
}

// find paths

const pathToMe = findPath(directOrbitGraph, "COM", "YOU");
const pathToSanta = findPath(directOrbitGraph, "COM", "SAN");

const { same, left, right } = splitWhereDifferent(pathToMe, pathToSanta);

const pathFromMeToSanta = [...left.reverse(), same[same.length - 1], ...right];

// ignore me and santa (-2)
// we are counting edges, but the array is of nodes (-1)
console.log(pathFromMeToSanta.length - 3);

function findPath(graph, start, end) {
    for (const child of graph.childrenOf(start)) {
        if (child === end) {
            return [start, end];
        }

        const pathToEndFromChild = findPath(graph, child, end);

        if (pathToEndFromChild) {
            return [start, ...pathToEndFromChild]
        }
    }

    return undefined;
}

function splitWhereDifferent(left, right) {
    const same = [];

    for (var i = 0; i < Math.min(left.length, right.length); i++) {
        if (left[i] === right[i]) {
            same.push(left[i]);
        } else {
            return {
                same,
                left: left.slice(i),
                right: right.slice(i),
            };
        }
    }
}
