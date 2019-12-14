const fs = require("fs");
const { Bag } = require("./Bag");

const file = fs.readFileSync("input2.txt").toString();

const rules = new Map();
file.split("\n")
    .filter(line => line !== "")
    .forEach(rule => {
        const [inputStr, outStr] = rule.split(" => ");
        const [outNum, outName] = outStr.trim().split(" ");

        // list of pairs, List<(number, name)>
        const inputs = inputStr.trim().split(", ")
            .map(ingredient => {
                const [inNum, inName] = ingredient.trim().split(" ");
                return {
                    qty: parseInt(inNum),
                    name: inName,
                }
            });

        if (rules.has(outName)) console.log("Oh no");
        rules.set(outName, {
            qtyOut: parseInt(outNum),
            recipies: inputs,
        });
    });

function oreToMake(resource, qty, onHand) {
    const qtyAlready = onHand.get(resource);

    onHand = onHand.clone();
    onHand.map.set(resource, Math.max(qtyAlready - qty, 0));
    qty -= qtyAlready;

    qty - onHand.get(resource);
    if (resource === "ORE") {
        return qty;
    }

    const { qtyOut, recipies } = rules.get(resource);
    const numOfBatches = Math.ceil(qty / qtyOut);

    let ore = 0;
    for (const recipie of recipies) {
        ore += oreToMake(recipie.name, recipie.qty, onHand);
    }

    return ore * numOfBatches;
}

console.log(oreToMake("FUEL", 1, new Bag()));
