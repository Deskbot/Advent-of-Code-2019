const bmpjs = require("bmp-js");
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
part2(layers.slice());

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

function part2(layers) {
    let finalImage = [];
    for (const layer of layers) {
        for (let i = 0; i < pixelsInLayer; i++) {
            if (finalImage[i] === undefined && layer[i] !== 2) {
                finalImage[i] = layer[i];
            }
        }
    }

    finalImage = finalImage.map((pixel) => {
        switch (pixel) {
            case 0: return 0x00000000;
            case 1: return 0x00FFFFFF;
        }
        return 0xFF000000;
    });

    const data = Buffer.alloc(layers.length * pixelsInLayer * 32);

    let offset = 0;
    for (const pixel of finalImage) {
        offset = data.writeUInt32BE(pixel, offset);
    }

    const bmp = bmpjs.encode({
        data,
        width,
        height,
    });

    fs.writeFileSync("output.bmp", bmp.data);
}
