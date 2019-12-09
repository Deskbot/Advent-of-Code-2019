class Program {
    constructor(initialState) {
        this.address = 0;
        this.state = initialState;
        this.inputs = [];
        this.halted = false;
        this.relativeBase = 0;
    }

    input(...vals) {
        this.inputs.push(...vals);
    }

    runUntilOutput() {
        if (this.halted) return;

        while (true) {
            const command = this.state[this.address];
            const opCode = command % 100;
            const positionMode1 = command % 1000 - opCode;
            const positionMode2 = command % 10000 - positionMode1 - opCode;
            const positionMode3 = command % 100000 - positionMode2 - positionMode1 - opCode;

            if (opCode == 99) {
                this.halted = true;
                return;
            }

            if (opCode === 1 || opCode === 2 || opCode === 7 || opCode === 8) {
                const param1 = this.state[this.address + 1];
                const param2 = this.state[this.address + 2];
                const param3 = this.state[this.address + 3];
                const operand1 = positionMode1 === 0 ? this.state[param1] : param1;
                const operand2 = positionMode2 === 0 ? this.state[param2] : param2;
                // const targetAddress = positionMode3 === 0 ? this.state[param3]: param3;
                const targetAddress = this.state[this.address + 3];
                this.address += 4;

                if (opCode === 1) {
                    this.state[targetAddress] = operand1 + operand2;
                } else if (opCode === 2) {
                    this.state[targetAddress] = operand1 * operand2;
                } else if (opCode === 7) {
                    this.state[targetAddress] = operand1 < operand2 ? 1 : 0;
                } else if (opCode === 8) {
                    this.state[targetAddress] = operand1 === operand2 ? 1 : 0;
                }

            } else if (opCode === 3) {
                const operandAddress = this.state[this.address + 1];
                this.state[operandAddress] = this.inputs.shift();
                this.address += 2;

            } else if (opCode === 4) {
                const operandAddress = this.state[this.address + 1];
                this.address += 2;
                return this.state[operandAddress];

            } else if (opCode === 5 || opCode === 6) {
                const param1 = this.state[this.address + 1];
                const param2 = this.state[this.address + 2];
                const testParam = positionMode1 === 0 ? this.state[param1] : param1;
                const goToParam = positionMode2 === 0 ? this.state[param2] : param2;
                this.address += 3;

                if (opCode === 5) {
                    if (testParam !== 0) {
                        this.address = goToParam;
                    }
                } else if (opCode === 6) {
                    if (testParam === 0) {
                        this.address = goToParam;
                    }
                }

            } else if (opCode === 9) {
                const param = this.state[this.address + 1];
                this.relativeBase += this.getValue(positionMode1, param);
                this.address += 1;

            } else {
                throw `Unrecognised opcode ${opCode} at address ${this.address} in program ${this.state}.`;
            }
        }
    }

    getValue(addressMode, param) {
        if (addressMode === 0) return this.state[param];
        if (addressMode === 1) return param;
        if (addressMode === 2) return this.state[param + this.relativeBase];
        throw `Unexpected addressMode ${addressMode} in program ${this}`;
    }
}

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
    Program,
};