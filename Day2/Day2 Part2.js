const fs = require("fs");

const file = fs.readFileSync("input.txt").toString();

const targetOutput = 19690720;

const baseProgram = file.split(",")
    .map(str => parseInt(str));

for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
        const program = [...baseProgram];
        program[1] = noun;
        program[2] = verb;

        const result = runProgram(program)[0];

        if (result === targetOutput) {
            console.log(`Noun ${noun}, Verb ${verb}, Together ${noun * 100 + verb}`);
            break;
        }
    }
}

function runProgram(program) {
    let address = 0;

    while (true) {
        const code = program[address];

        if (code == 99) {
            break;
        }

        const operand1Address = program[address + 1];
        const operand2Address = program[address + 2];
        const operand1 = program[operand1Address];
        const operand2 = program[operand2Address];
        const targetAddress = program[address + 3];

        if (code == 1) {
            program[targetAddress] = operand1 + operand2;
        } else if (code == 2) {
            program[targetAddress] = operand1 * operand2;

        } else {
            throw `Unrecognised opcode ${code} at address ${address} in program ${program}.`;
        }

        address += 4;
    }

    return program;
}
