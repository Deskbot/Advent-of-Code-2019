const fs = require("fs");
const { Program } = require("../IntCode");
const { World } = require("./World");
const { Grid } = require("../Grid");
const { PredSet } = require("../PredSet");

const start = [22,19];
// generated from running the droid, with the final D replaced with a .
const mazeStr = `
#########################################
#...#.........#.....#.......#...#.......#
#.#.#.#.#####.###.#.#######.#.#.#...#...#
#.#...#...#.......#.........#.#.#...#...#
#.#...###.###############.###.#.###.#.#.#
#.#...#.#...#...#.#.......#...#.....#.#.#
#.#.#.#.###.#.#.#.#.#######.....#...#.#.#
#.#.#.#...#...#.#...#.......#.###...#.#.#
#...#...#.#.....#.###.#...#...#...#...#.#
#...#...#.#.....#.#...#.#.#.###...#...#.#
#########.#.#######.#...#.#...#.#######.#
#...#...#.#.......#.#.###.#.###.#.......#
#.#.###.#.#####...#.#.#...#.#...#.#####.#
#.#...#.#.#...#...#.#.#.###.#...#.#...#.#
#.###.#.#.###.#.###.#.#.#...#.###.#.#.###
#.#.....#.....#.....#.#.#.###.#...#.#...#
#.###.#######.#####...#.#.#...#.###.#...#
#...#.#...#...#...#.###.#.#...#.#...#...#
###.###.#.#.#####.#.#...#.#.#####...#.###
#...#...#...#...#.#.#...#.#.#.....###...#
#.###.#######.#.#.#...#.#.#.#...#.......#
#.....#.......#...#####.###...###.......#
#.#########.#####.#####.#.........#######
#.#.........#.......#...#.........#.....#
#.#.###.#####.#######.#...#############.#
#.#.#...#...#.....#...###.#...#.........#
#.#.#.###.#.#####.#.#.....#.###.###.###.#
#.#.#.#...#.#.....#.#.....#.....#...#...#
#.###.#.###.#.#####...###########.###.###
#.....#.#.#.#...#.#...#...........#...#.#
#######.#.#.###.#.#####.###.#######.###.#
#.#.....#...#...#...#.....#...#...#...#.#
#.#.#.###.###.###.#.#########.#.#####.#.#
#...#...#.#...#...#...#.....#.#.....#.#.#
#.#####.###.#####.###.#.###.#.#.###.#.#.#
#.#...#.....#...#...#.#.#...#.#...#.#...#
#.###.#######.#.###.#.#.###.#.#.###.###.#
#...#.........#...#.#.#...#...#.#.....#.#
###.#.###########.#.#.###.#####.#.#####.#
#.....#.............#.....#.....#.......#
 ##### ############# ##### ##### #######
`

const osNeeded = mazeStr.match(/\./g).length;

// outputMaze();
oxygen();

function outputMaze() {
    const oppositeDir = {
        1: 2,
        2: 1,
        3: 4,
        4: 3,
    }

    const leftOf = {
        1: 3,
        2: 4,
        3: 2,
        4: 1,
    }

    const rightOf = {
        1: 4,
        2: 3,
        3: 1,
        4: 2,
    }

    const code = fs.readFileSync("input.txt").toString()
        .split(",")
        .filter(num => num !== "")
        .map(num => parseInt(num));

    const game = new Program(code);
    const runner = game.run();

    const world = new World();
    const moves = [];
    let moveDir = 1;
    let firstMove = true;

    while (true) {
        console.log(world.grid.toString());
        console.log(moves.length)

        game.input(moveDir);

        const status = step(runner, moveDir);

        if (status === true || !firstMove && world.x === 0 && world.y === 0) break;

        if (status === 0) {
            moveDir = rightOf[moveDir];
        } else {
            firstMove = false;
            moveDir = leftOf[moveDir];
        }
    }

    console.log(world.grid.toString());
    console.log(moves);
    console.log(moves.length + 1) // dunno why I need to add 1, tried it and it was right

    function step(runner, dir) {
        const { value: status, done } = runner.next();

        if (done) return true;

        if (status === 0) {
            if (dir === 1) {
                world.wallNorth();
            } else if (dir === 2) {
                world.wallSouth();
            } else if (dir === 3) {
                world.wallWest();
            } else { // 4
                world.wallEast();
            }
        } else if (status === 1) {
            if (dir === 1) {
                world.moveNorth();
            } else if (dir === 2) {
                world.moveSouth();
            } else if (dir === 3) {
                world.moveWest();
            } else { // 4
                world.moveEast();
            }

            if (dir === oppositeDir[moves[moves.length - 1]]) {
                moves.pop();
            } else {
                moves.push(dir);
            }
        }

        return status;
    }
}

function oxygen() {
    const maze = mazeStr.split('\n')
        .filter(char => char !== '')
        .map(row => row.split('')
            .filter(char => char !== ''));

    const grid = new Grid();

    for (const [y, row] of maze.entries()) {
        for (const [x, char] of row.entries()) {
            if (char === ".") {
                grid.put(x, y, {
                    x,
                    y,
                    neighbours: adjacentCells(maze, x, y),
                });
            }
        }
    }

    let hasO = new PredSet(eq);
    let needToAdd = [grid.get(...start)];
    let i = 0;

    while (hasO.set.length < osNeeded) {
        const aboutToAdd = needToAdd;
        needToAdd = [];

        for (const node of aboutToAdd) {
            const { neighbours } = node;
            const adjCells = neighbours.map(([x, y]) => grid.get(x, y));
            needToAdd.push(...adjCells.filter(c => !hasO.has(c)));
            hasO.put(node);
        }

        i++;
    }

    console.log(hasO.set.length, osNeeded, i);
}

function adjacentCells(maze, x, y) {
    return [
        [x+1, y],
        [x-1, y],
        [x, y+1],
        [x, y-1],
    ].filter(([possX, possY]) => maze[possY][possX] === ".");
}

function eq(cell1, cell2) {
    return cell1.x === cell2.x && cell1.y === cell2.y;
}
