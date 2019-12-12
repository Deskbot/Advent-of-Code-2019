// input
// <x=0, y=6, z=1>
// <x=4, y=4, z=19>
// <x=-11, y=1, z=8>
// <x=2, y=19, z=15>

const axes = ["x", "y", "z"];

const moonStartStates = [
    { name: "Io",       pos: { x:   0, y:  6, z:  1 }, vel: { x: 0, y: 0, z: 0 } },
    { name: "Europa",   pos: { x:   4, y:  4, z: 19 }, vel: { x: 0, y: 0, z: 0 } },
    { name: "Ganymede", pos: { x: -11, y:  1, z:  8 }, vel: { x: 0, y: 0, z: 0 } },
    { name: "Callisto", pos: { x:   2, y: 19, z: 15 }, vel: { x: 0, y: 0, z: 0 } }
];

part1();

function allPairs(list) {
    return list.flatMap((item, i) => {
        return list.slice(i + 1).map(otherItem => [item, otherItem]);
    });
}

function applyGravity(moons) {
    const newMoons = deepCopy(moons);
    for (const [m1, m2] of allPairs(moons)) {
        for (const axis of axes) {
            if (m1.pos[axis] < m2.pos[axis]) {
                newMoons[m1.name].pos[axis]++;
                newMoons[m2.name].pos[axis]--;
            } else if (m1[axis] > m2[axis]) {
                newMoons[m1.name].pos[axis]--;
                newMoons[m2.name].pos[axis]++;
            }
        }
    }
    return newMoons;
}

function applyVelocity(moons) {
    const newMoons = deepCopy(moons);
    for (const moon of newMoons) {
        for (axis of axes) {
            moon.pos[axis] += moon.vel[axis];
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

    const totalMoonEnergy = moons.reduce((tot, moon) => tot + energy(moon), 0);

    console.log(totalMoonEnergy);
}

