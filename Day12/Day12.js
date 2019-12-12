// input
// <x=0, y=6, z=1>
// <x=4, y=4, z=19>
// <x=-11, y=1, z=8>
// <x=2, y=19, z=15>

const Io =       { x:   0, y:  6, z:  1 };
const Europa =   { x:   4, y:  4, z: 19 };
const Ganymede = { x: -11, y:  1, z:  8 };
const Callisto = { x:   2, y: 19, z: 15 };

const moons = [
    { name: "Io", pos: Io },
    { name: "Europa", pos: Europa },
    { name: "Ganymede", pos: Ganymede },
    { name: "Callisto", pos: Callisto }
];

const moonPairs = moons.flatMap((moon, i) => {
    return moons.slice(i + 1).map(otherMoon => [moon, otherMoon]);
});

console.log(moonPairs);
