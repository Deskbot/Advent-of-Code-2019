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

const directOrbitGraph = new Digraph();

bodies.forEach(body => directOrbitGraph.addNode(body))

for (const orbit of orbits) {
    const [nom, acc] = orbit.split(")");
    directOrbitGraph.addEdge(nom, acc);
}

let totalOrbits = 0;

for (const body of bodies) {
    totalOrbits += childCount(directOrbitGraph, body);
}

function childCount(graph, node) {
    const children = [...graph.childrenOf(node)];
    return children.length
        + children
            .map(child => childCount(graph, child))
            .reduce((tot, curr) => tot + curr, 0);
}

console.log(totalOrbits);