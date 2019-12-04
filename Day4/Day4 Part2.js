const min = 138307;
const max = 654504;

const validPasswords = [];

for (let i = min; i <= max; i++) {
    const numChars = i.toString().split("");

    if (notDecreasing(numChars) && containsPureDouble(numChars)) {
        validPasswords.push(i);
    }
}

console.log(validPasswords.length);

function containsPureDouble(arr) {
    let lastElem = arr[0];
    let consecutiveElems = 1;

    for (let i = 1; i < arr.length; i++) {
        const elem = arr[i];

        if (elem === lastElem) {
            consecutiveElems++;
        } else if (consecutiveElems === 2) {
            return true;
        } else {
            lastElem = elem;
            consecutiveElems = 1;
        }
    }

    if (consecutiveElems === 2) {
        return true;
    }

    return false;
}

function notDecreasing(arr) {
    let lastElem = arr[0];

    for (const elem of arr.slice(1)) {
        if (elem < lastElem) {
            return false;
        }

        lastElem = elem;
    }

    return true;
}
