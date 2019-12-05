const fs = require("fs");

const file = fs.readFileSync("input.txt").toString();

const program = file.split(",")
    .filter(line => line !== "")
    .map(str => parseInt(str));

const input = 1;
const output = runProgram(input, program);

console.log(output);

function runProgram(input, program) {
    let address = 0;
    let output;

    while (true) {
        const command = program[address];
        const opCode = command % 100;
        const positionMode1 = command % 1000 - opCode;
        const positionMode2 = command % 10000 - positionMode1 - opCode;
        // const positionMode3 = command % 100000 - positionMode2 - positionMode1 - opCode;

        if (opCode == 99) {
            break;
        }

        if (opCode === 1 || opCode === 2) {
            const param1 = program[address + 1];
            const param2 = program[address + 2];
            const operand1 = positionMode1 === 0 ? program[param1] : param1;
            const operand2 = positionMode2 === 0 ? program[param2] : param2;
            const targetAddress = program[address + 3];
            address += 4;

            if (opCode === 1) {
                program[targetAddress] = operand1 + operand2;
            } else {
                program[targetAddress] = operand1 * operand2;
            }

        } else if (opCode === 3) {
            const operandAddress = program[address + 1];
            program[operandAddress] = input;
            address += 2;

        } else if (opCode === 4) {
            const operandAddress = program[address + 1];
            output = program[operandAddress];
            address += 2;

        } else {
            throw `Unrecognised opcode ${opCode} at address ${address} in program ${program}.`;
        }
    }

    return output;
}
