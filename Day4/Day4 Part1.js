const min = 138307;
const max = 654504;

const validPasswords = [];

for (let i = min; i <= max; i++) {
    const num = i.toString().split("");

    if (containsDouble(num) && notDecreasing(num)) {
        validPasswords.push(i);
    }
}

console.log(validPasswords.length);

function containsDouble(arr) {
    let lastElem = arr[0];

    for (let i = 1; i < arr.length; i++) {
        const elem = arr[i];
        if (elem === lastElem) {
            return true;
        }

        lastElem = elem;
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
