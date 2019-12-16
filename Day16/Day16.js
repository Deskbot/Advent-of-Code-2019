const fs = require("fs");

part1();

function part1() {
    let signal = fs.readFileSync("input.txt").toString()
        .split("")
        .filter(num => num !== "")
        .map(num => parseInt(num));

    signal = [1,2,3,4,5,6,7,8];
    const base = [0, 1, 0, -1];

    console.log(phase(base, signal))
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
    const phaseIterator = [...range(0, signal.length)]
        .map(index => drop(1, pattern(base, index + 1), signal.length))
        .map(itr => top(itr, signal.length))
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

function* top(itr, n) {
    for (let i = 0; i < n; i++) {
        yield itr.next().value;
    }
}

function* zip(left, right) {
    while (true) {
        yield [left.next().value, right.next().value];
    }
}