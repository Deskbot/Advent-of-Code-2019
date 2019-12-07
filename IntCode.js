function runProgram(inputs, program) {
    const input = inputs[Symbol.iterator]();
    let address = 0;
    let output;

    while (true) {
        const command = program[address];
        const opCode = command % 100;
        const positionMode1 = command % 1000 - opCode;
        const positionMode2 = command % 10000 - positionMode1 - opCode;
        const positionMode3 = command % 100000 - positionMode2 - positionMode1 - opCode;

        if (opCode == 99) {
            break;
        }

        if (opCode === 1 || opCode === 2 || opCode === 7 || opCode === 8) {
            const param1 = program[address + 1];
            const param2 = program[address + 2];
            const param3 = program[address + 3];
            const operand1 = positionMode1 === 0 ? program[param1] : param1;
            const operand2 = positionMode2 === 0 ? program[param2] : param2;
            // const targetAddress = positionMode3 === 0 ? program[param3]: param3;
            const targetAddress = program[address + 3];
            address += 4;

            if (opCode === 1) {
                program[targetAddress] = operand1 + operand2;
            } else if (opCode === 2) {
                program[targetAddress] = operand1 * operand2;
            } else if (opCode === 7) {
                program[targetAddress] = operand1 < operand2 ? 1 : 0;
            } else if (opCode === 8) {
                program[targetAddress] = operand1 === operand2 ? 1 : 0;
            }

        } else if (opCode === 3) {
            const operandAddress = program[address + 1];
            program[operandAddress] = input.next().value;
            address += 2;

        } else if (opCode === 4) {
            const operandAddress = program[address + 1];
            output = program[operandAddress];
            address += 2;

        } else if (opCode === 5 || opCode === 6) {
            const param1 = program[address + 1];
            const param2 = program[address + 2];
            const testParam = positionMode1 === 0 ? program[param1] : param1;
            const goToParam = positionMode2 === 0 ? program[param2] : param2;
            address += 3;

            if (opCode === 5) {
                if (testParam !== 0) {
                    address = goToParam;
                }
            } else if (opCode === 6) {
                if (testParam === 0) {
                    address = goToParam;
                }
            }

        } else {
            throw `Unrecognised opcode ${opCode} at address ${address} in program ${program}.`;
        }
    }

    return output;
}

module.exports = {
    runProgram,
};