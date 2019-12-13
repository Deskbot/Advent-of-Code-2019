// input
// <x=0, y=6, z=1>
// <x=4, y=4, z=19>
// <x=-11, y=1, z=8>
// <x=2, y=19, z=15>

const axes = ["x", "y", "z"];

const moonStartStates = {
    "Io":       { pos: { x:   0, y:  6, z:  1 }, vel: { x: 0, y: 0, z: 0 } },
    "Europa":   { pos: { x:   4, y:  4, z: 19 }, vel: { x: 0, y: 0, z: 0 } },
    "Ganymede": { pos: { x: -11, y:  1, z:  8 }, vel: { x: 0, y: 0, z: 0 } },
    "Callisto": { pos: { x:   2, y: 19, z: 15 }, vel: { x: 0, y: 0, z: 0 } }
};

part1();
part2();

function allPairs(list) {
    return list.flatMap((item, i) => {
        return list.slice(i + 1).map(otherItem => [item, otherItem]);
    });
}

function applyGravity(moons) {
    const newMoons = deepCopy(moons);
    for (const [m1, m2] of allPairs(Object.keys(newMoons))) {
        for (const axis of axes) {
            if (moons[m1].pos[axis] < moons[m2].pos[axis]) {
                newMoons[m1].vel[axis]++;
                newMoons[m2].vel[axis]--;
            } else if (moons[m1].pos[axis] > moons[m2].pos[axis]) {
                newMoons[m1].vel[axis]--;
                newMoons[m2].vel[axis]++;
            }
        }
    }
    return newMoons;
}

function applyVelocity(moons) {
    const newMoons = deepCopy(moons);
    for (const moonName in newMoons) {
        for (axis of axes) {
            newMoons[moonName].pos[axis] += moons[moonName].vel[axis];
        }
    }
    return newMoons;
}

function deepCopy(basicObject) {
    return JSON.parse(JSON.stringify(basicObject));
}

function energy(moon) {
    return kineticEnery(moon) * potentialEnergy(moon);
}

function kineticEnery(moon) {
    return Math.abs(moon.vel.x)
        + Math.abs(moon.vel.y)
        + Math.abs(moon.vel.z);
}

function potentialEnergy(moon) {
    return Math.abs(moon.pos.x)
        + Math.abs(moon.pos.y)
        + Math.abs(moon.pos.z);
}

function part1() {
    let moons = deepCopy(moonStartStates);
    for (let i = 1; i <= 1000; i++) {
        moons = applyGravity(moons);
        moons = applyVelocity(moons);
    }

    const totalMoonEnergy = Object.values(moons)
        .reduce((tot, moon) => tot + energy(moon), 0);

    console.log(totalMoonEnergy);
}


function moonStatesAreEqual(moons1, moons2) {
    for (const moonName in moons1) {
        if (moonsEqual(moons1[moonName], moons2[moonName])) {
            return false;
        }
    }
    return true;
}

function moonsEqual(m1, m2) {
    for (const axis of axes) {
        if (m1[axis] !== m2[axis]) return false;
    }

    return true;
}

function part2() {
    let moons = deepCopy(moonStartStates);

    for (var i = 1; i < Infinity; i++) {
        moons = applyGravity(moons);
        moons = applyVelocity(moons);

        if (moonStatesAreEqual(moons, moonStartStates)) {
            break;
        }
    }

    console.log(i);
}
