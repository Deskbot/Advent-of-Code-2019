const fs = require("fs");
const { runProgram } = require("../IntCode");

const file = fs.readFileSync("input.txt").toString();
const program = file.split(",")
    .filter(line => line !== "")
    .map(str => parseInt(str));

const thrusts = [];
for (const phaseSetting of allOrderings([0,1,2,3,4])) {
    let io = 0;
    for (const ampPhase of phaseSetting) {
        io = runProgram([ampPhase,io], program.slice());
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
