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
        ingredients: inputs,
    });
});

const { ingredients } = rules.get("FUEL");
const have = new Bag(); // name to qty
let need = new Bag(); // name to qty

while (!hasOre(need) || hasOre(need) && onlyOre(need)) {
    for (const ingredient of ingredients) {
        const { name, qty } = ingredient;
        need.add(name, qty);
    }
    const newNeed = new Bag();
    for (const [needName, needQty] of need.map) {
        const haveQty = have.get(needName);
        newNeed.add(needName, needQty - haveQty);
        have.add(needName, -haveQty);
    }
    need = newNeed;
}

console.log(need.get("ORE"))

function onlyOre(bag) {
    for (const [name, qty] of bag.map) {
        if (name !== "ORE" && qty > 0) return false;
    }

    return true;
}

function hasOre(bag) {
    return [...bag.map.keys()].includes("ORE")
}