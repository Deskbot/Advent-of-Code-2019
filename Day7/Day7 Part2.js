const fs = require("fs");
const { Program } = require("../IntCode");

const file = fs.readFileSync("input.txt").toString();
const baseProgram = file.split(",")
    .filter(line => line !== "")
    .map(str => parseInt(str));

const thrusts = [];
for (const phaseSetting of allOrderings([5,6,7,8,9])) {
    let io = 0;

    const amps = [
        new Program(baseProgram),
        new Program(baseProgram),
        new Program(baseProgram),
        new Program(baseProgram),
        new Program(baseProgram),
    ]

    amps.forEach((amp, i) => {
        amp.input(phaseSetting[i]);
    });

    for (const amp of infiniteSauce(amps)) {
        amp.input(io);

        const output = amp.runUntilOutput();

        if (output === undefined) { // halted
            if (amp === amps[4]) {
                break;
            }
        } else {
            io = output;
        }
    }

    thrusts.push(io);
}

console.log(Math.max(...thrusts));

function allOrderings(list) {
    // only one permutation
    if (list.length <= 1) return [list];

    // map each element to a list of possible orderings
    // that start with that element
    // flatten to unwrap each group of possible orderings
    return list.flatMap((elem, i) => {
        // clone the list and remove the current item
        const otherElems = list.slice();
        otherElems.splice(i, 1);

        // put the current elem before each of
        // the possible following sequences of elems
        return allOrderings(otherElems)
            .map(toFollow => [elem, ...toFollow]);
    });
}

function* infiniteSauce(sauce) {
    let i = 0;
    while (true) {
        yield sauce[i];
        i = (i + 1) % sauce.length;
    }
}