const fs = require("fs");

const base = [0, 1, 0, -1];

part1();

function part1() {
    let initialSignal = fs.readFileSync("input.txt").toString()
        .split("")
        .filter(num => num.trim() !== "")
        .map(num => parseInt(num));

    // initialSignal = "80871224585914546619083218645595".split("").map(n => parseInt(n));

    const finalSignal = new Array(100).fill(phase)
        .map(phase => signal => phase(base, signal))
        .reduce(
            (acc, nextF) => nextF(acc),
            initialSignal
        );

    console.log(finalSignal.join(''));
}

function* drop(n, itr) {
    for (let i = 0; i < n; i++) {
        itr.next();
    }

    yield* itr;
}

function oneDigit(num) {
    return Math.abs(num % 10);
}

function phase(base, signal) {
    const phaseIterator = [...range(1, signal.length + 1)]
        .map(index => drop(1, pattern(base, index)))
        .map(itr => top(signal.length, itr))
        .map(pattern => prodSum(pattern, signal.values()))

    return [...phaseIterator];
}

function prodSum(left, right) {
    let tot = 0;
    while (true) {
        const { value: leftVal, done: doneLeft } = left.next();
        const { value: rightVal, done: doneRight } = right.next();

        if (doneLeft || doneRight) break;

        tot += leftVal * rightVal;
    }
    return oneDigit(tot);
}

function* pattern(base, n) {
    let i = 0;
    while (true) {
        yield base[Math.floor(i / n) % base.length];
        i += 1;
    }
}

function* range(startWith, endBefore) {
    for (let i = startWith; i < endBefore; i++) {
        yield i;
    }
}

function* top(n, itr) {
    for (let i = 0; i < n; i++) {
        yield itr.next().value;
    }
}
