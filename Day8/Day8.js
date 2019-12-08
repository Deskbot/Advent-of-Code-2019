const fs = require("fs");

const file = fs.readFileSync("input.txt").toString();

const image = file.split("")
    .filter(str => str.trim() !== "")
    .map(str => parseInt(str));

const width = 25;
const height = 6;
const pixelsInLayer = width * height;

const layers = [];
while (image.length > 0) {
    layers.push(image.splice(0, pixelsInLayer));
}

part1(layers.slice());

function countEqual(arr, valToEqual) {
    return arr.filter(val => val === valToEqual).length;
}

function part1(layers) {
    layers.sort((layer1, layer2) => {
        return countEqual(layer1, 0) - countEqual(layer2, 0);
    });

    const layerWithFewestZeros = layers[0];

    console.log(countEqual(layerWithFewestZeros, 1) * countEqual(layerWithFewestZeros, 2));
}