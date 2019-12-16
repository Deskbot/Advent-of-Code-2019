const fs = require("fs");
const { MemoTwo } = require("../memo");

class Pattern {
    constructor(base, digitNum) {
        this.base = base;
        this.digitNum = digitNum;
    }

    get(n) {
        return this.base[Math.floor(n / this.digitNum) % this.base.length];
    }
}

class Repeat {
    constructor(list, times) {
        this.list = list;
        this.times = times;
    }

    get(n) {
        return this.list[n % this.times];
    }

    get length() {
        return this.list.length * this.times;
    }
}

const base = [0, 1, 0, -1];

part2();

function part2() {
    const initialSignalNotRepeated = fs.readFileSync("input.txt").toString()
        .split("")
        .filter(num => num.trim() !== "")
        .map(num => parseInt(num));

    const initialSignal = new Repeat(initialSignalNotRepeated, 10000);
    const digitsToSkip = parseInt(initialSignal.list.slice(0, 7).join(""));

    const digitsToOutput = [...range(digitsToSkip, digitsToSkip + 8)];
    const digitMemo = new MemoTwo();

    const output = digitsToOutput.map(digitNum => digit(digitNum, 100)).join("");
    console.log(output);

    function digit(digitNum, phaseNum) {
        const existingResult = digitMemo.get(digitNum, phaseNum);
        if (existingResult !== undefined) return existingResult;

        if (phaseNum === 0) {
            return initialSignal.get(digitNum);
        }

        let baseVals = new Pattern(base, digitNum);
        let tot = 0;
        for (let i = 0; i < initialSignal.length; i++) {
            const baseVal = baseVals.get(i + 1);

            if (baseVal === 0) continue;

            tot += baseVal * digit(i, phaseNum - 1);
        }

        console.log(digitNum, phaseNum, oneDigit(tot));

        const result = oneDigit(tot);
        digitMemo.put(digitNum, phaseNum, result);

        return result;
    }
}

function oneDigit(num) {
    return Math.abs(num % 10);
}

function* range(startWith, endBefore) {
    for (let i = startWith; i < endBefore; i++) {
        yield i;
    }
}
