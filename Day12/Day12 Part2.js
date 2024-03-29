// input
// <x=0, y=6, z=1>
// <x=4, y=4, z=19>
// <x=-11, y=1, z=8>
// <x=2, y=19, z=15>

const axes = ["x", "y", "z"];

const moonStartStates = {
    "Io": { pos: { x: 0, y: 6, z: 1 }, vel: { x: 0, y: 0, z: 0 } },
    "Europa": { pos: { x: 4, y: 4, z: 19 }, vel: { x: 0, y: 0, z: 0 } },
    "Ganymede": { pos: { x: -11, y: 1, z: 8 }, vel: { x: 0, y: 0, z: 0 } },
    "Callisto": { pos: { x: 2, y: 19, z: 15 }, vel: { x: 0, y: 0, z: 0 } }
};

const allPairsOfMoonNames = allPairs(Object.keys(moonStartStates));
let axis = "x"

part2();

function allPairs(list) {
    return list.flatMap((item, i) => {
        return list.slice(i + 1).map(otherItem => [item, otherItem]);
    });
}

function increment(tick, axis, moons) {
    const smallestGap = Math.min(...allPairsOfMoonNames
        .map(([m1,m2]) => {
            return Math.abs(moons[m1].pos[axis] - moons[m2].pos[axis]);
        }));

    // apply gravity
    const newMoons = deepCopy(moons);
    for (const [m1, m2] of allPairsOfMoonNames) {
        if (moons[m1].pos[axis] < moons[m2].pos[axis]) {
            newMoons[m1].vel[axis] += smallestGap;
            newMoons[m2].vel[axis] -= smallestGap;
        } else if (moons[m1].pos[axis] > moons[m2].pos[axis]) {
            newMoons[m1].vel[axis] -= smallestGap;
            newMoons[m2].vel[axis] += smallestGap;
        }
    }

    for (const moonName in newMoons) {
        const currentVel = moons[moonName].vel[axis];
        newMoons[moonName].pos[axis] += sumOfNumsBetween(currentVel, currentVel + smallestGap);
    }

    if (moonStatesAreEqual(moons, newMoons)) {
        console.log(tick, smallestGap, tick + smallestGap);
        return tick + smallestGap;
    }

    return increment(tick + smallestGap, axis, newMoons);
}

// a simplified version of subtracting triangle nums to a
// from triangle nums to b
function sumOfNumsBetween(a, b) {
    return (b * b - a * a + b - a) / 2;
}

function applyGravity(moons) {
    const newMoons = deepCopy(moons);
    for (const [m1, m2] of allPairsOfMoonNames) {
        if (moons[m1].pos[axis] < moons[m2].pos[axis]) {
            newMoons[m1].vel[axis]++;
            newMoons[m2].vel[axis]--;
        } else if (moons[m1].pos[axis] > moons[m2].pos[axis]) {
            newMoons[m1].vel[axis]--;
            newMoons[m2].vel[axis]++;
        }
        // for (const axis of axes) {
        // }
    }
    return newMoons;
}

function applyVelocity(moons) {
    // const newMoons = deepCopy(moons); // ???
    for (const moonName in newMoons) {
        newMoons[moonName].pos[axis] += moons[moonName].vel[axis];
        // for (axis of axes) {
        // }
    }
    return newMoons;
}

// taken from 9th example in https://jsperf.com/deep-cloning-of-objects/51
function deepCopy(obj) {
    var i, len, ret;

    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        ret = [];
        len = obj.length;
        for (i = 0; i < len; i++) {
            ret.push((typeof obj[i] === 'object' && obj[i] !== null) ? deepCopy(obj[i]) : obj[i]);
        }
    } else {
        ret = {};
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                ret[i] = (typeof obj[i] === 'object' && obj[i] !== null) ? deepCopy(obj[i]) : obj[i];
            }
        }
    }

    return ret;
}

function moonStatesAreEqual(moons1, moons2) {
    for (const moonName in moons1) {
        if (!moonsEqual(moons1[moonName], moons2[moonName])) {
            return false;
        }
    }
    return true;
}

function moonsEqual(m1, m2) {
    if (m1.pos[axis] !== m2.pos[axis]
        || m1.vel[axis] !== m2.vel[axis]
    ) {
        return false;
    }

    return true;
}

function part2() {
    let moons = deepCopy(moonStartStates);
    let time = new Date().getTime();
    axis = "x";

    console.log(increment(0, "x", moons));

    // for (var i = 1; i < Infinity; i++) {
    //     moons = applyGravity(moons);
    //     moons = applyVelocity(moons);

    //     if (moonStatesAreEqual(moons, moonStartStates)) {
    //         console.log(i);
    //     }

    //     // if (i % 1000 < 1) {
    //     //     console.log(i)
    //     //     const newTime = new Date().getTime();
    //     //     console.log(newTime - time);
    //     //     time = newTime;
    //     // }
    // }
}
