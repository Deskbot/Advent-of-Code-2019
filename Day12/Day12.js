// input
// <x=0, y=6, z=1>
// <x=4, y=4, z=19>
// <x=-11, y=1, z=8>
// <x=2, y=19, z=15>

const axes = ["x", "y", "z"];

const moons = [
    { name: "Io",       pos: { x:   0, y:  6, z:  1 }, vel: { x: 0, y: 0, x: 0 } },
    { name: "Europa",   pos: { x:   4, y:  4, z: 19 }, vel: { x: 0, y: 0, x: 0 } },
    { name: "Ganymede", pos: { x: -11, y:  1, z:  8 }, vel: { x: 0, y: 0, x: 0 } },
    { name: "Callisto", pos: { x:   2, y: 19, z: 15 }, vel: { x: 0, y: 0, x: 0 } }
];

function allPairs(list) {
    return list.flatMap((item, i) => {
        return list.slice(i + 1).map(otherItem => [item, otherItem]);
    });
}

function applyGravity(moons) {
    const newMoons = JSON.parse(JSON.stringify(moons));
    for (const [m1, m2] of allPairs(moons)) {
        for (const axis of axes) {
            if (m1[axis] < m2[axis]) {
                newMoons[m1.name].vel[axis]++;
                newMoons[m2.name].vel[axis]--;
            } else if (m1[axis] > m2[axis]) {
                newMoons[m1.name].vel[axis]--;
                newMoons[m2.name].vel[axis]++;
            }
        }
    }
    return newMoons;
}

function applyVelocity(moons) {
    const newMoons = JSON.parse(JSON.stringify(moons));
    for (const moon of newMoons) {
        for (axis of axes) {
            moon.pos[axis] += moon.vel[axis];
        }
    }
    return newMoons;
}
