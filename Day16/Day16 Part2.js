
class Repeat {
    constructor(list, times) {
        this.list = list;
        this.times = times;
    }

    get(n) {
        return this.list[n % times];
    }

    get length() {
        return this.list.length * this.times;
    }
}

const base = [0, 1, 0, -1];

part2();

function part2() {
    const initialSignalItr = fs.readFileSync("input.txt").toString()
        .split("")
        .filter(num => num.trim() !== "")
        .map(num => parseInt(num));

    const initialSignal = new Repeat(initialSignalItr, 10000);
    const digitsToSkip = parseInt(initialSignal.list.slice(0, 8).join(""));

    const digitsToOutput = [...range(digitsToSkip, digitsToSkip + 8)];

    const output = digitsToOutput.map(digitNum => digit(digitNum, 100)).join("");
    console.log(output);

    function digit(digitNum, phaseNum) {
        if (phaseNum === 0) {
            return initialSignal.get(digitNum);
        }

        let baseVals = [...top(initialSignal.length, drop(1, pattern(base, digitNum + 1)))];
        let tot = 0;
        for (const [i, baseVal] of baseVals.entries()) {
            if (baseVal === 0) continue;

            tot += baseVal * digit(i, phaseNum - 1);
        }

        console.log(digitNum, phaseNum, oneDigit(tot));
        return oneDigit(tot);
    }
}