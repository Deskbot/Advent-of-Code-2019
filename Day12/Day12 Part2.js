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

part2();

function applyGravity(moons) {
    const newMoons = deepCopy(moons);

    for (const axis of axes) {
        const moonsAlongAxis = newMoons.sort((moon1, moon2) => moon1.vel[axis] - moon2.vel[axis]);

        // adjust velocities by their rank
        for (const [moon, i] of moonsAlongAxis.entries()) {
            moon.vel[axis] = i * (-1) + moonsAlongAxis.length;
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
