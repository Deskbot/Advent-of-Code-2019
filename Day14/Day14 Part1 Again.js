const fs = require("fs");
const { Bag } = require("./Bag");

const file = fs.readFileSync("input.txt").toString();

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

part1();
part2();

function oreToMake(resource, qtyWanted, onHand) {
    const qtyAlready = onHand.get(resource);

    // number that actually need to be made
    const qty = Math.max(qtyWanted - qtyAlready, 0);
    onHand.map.set(resource, Math.max(qtyAlready - qtyWanted, 0));

    if (qty === 0) return 0;

    if (resource === "ORE") {
        return qty;
    }

    const { qtyOut, recipies } = rules.get(resource);
    const numOfBatches = Math.ceil(qty / qtyOut);
    const leftOver = numOfBatches * qtyOut - qty;

    let ore = 0;
    for (const recipie of recipies) {
        ore += oreToMake(recipie.name, recipie.qty * numOfBatches, onHand);
    }

    onHand.add(resource, leftOver);

    // console.log(resource, qty, numOfBatches, ore, ore * numOfBatches);
    return ore;
}

function part1() {
    console.log(oreToMake("FUEL", 1, new Bag()));
}

function part2() {
    const trillion = 1000000000000;
    let qtyOfFuelToAttempt = Math.floor(trillion / 97422);
    // let maxFuelPossible = -Infinity;
    // let minFuelPossible = Infinity;

    // while (true) {
    //     const oreRequired = oreToMake("FUEL", qtyOfFuelToAttempt, new Bag());

    //     if (oreRequired === trillion) {
    //         break;
    //     }

    //     if (oreRequired > trillion) {

    //     }
    // }

    console.log(
        binSearch(
            qty => oreToMake("FUEL", qty, new Bag()),
            0,
            trillion,
            trillion,
            qtyOfFuelToAttempt
        )
    );
}

function binSearch(provider, min, max, target, input) {
    return search(input, min, max);

    function search(input, min, max) {
        const found = provider(input);

        if (min === max) {
            return input;
        }

        if (found === target) return input;

        if (found > target) {
            // smaller input
            return search(halfway(min, input - 1), min, input - 1);
        } else {
            // bigger input
            return search(halfway(max, input + 1), input + 1, max);
        }
    }

    function halfway(left, right) {
        return Math.floor((left + right) / 2);
    }
}