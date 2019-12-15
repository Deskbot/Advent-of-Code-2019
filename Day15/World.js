const { Grid } = require("../Grid");

const path = ".";
const wall = "#";
const droid = "D";

class World {
    constructor() {
        this.grid = new Grid();
        this.x = 0;
        this.y = 0;
        this.grid.put(this.x, this.y, droid);
    }

    moveNorth() {
        this.grid.put(this.x, this.y, path)
        this.grid.put(this.x, --this.y, droid);
    }

    moveSouth() {
        this.grid.put(this.x, this.y, path)
        this.grid.put(this.x, ++this.y, droid);
    }

    moveEast() {
        this.grid.put(this.x, this.y, path)
        this.grid.put(++this.x, this.y, droid);
    }

    moveWest() {
        this.grid.put(this.x, this.y, path)
        this.grid.put(--this.x, this.y, droid);
    }

    wallNorth() {
        this.grid.put(this.x, this.y - 1, wall);
    }

    wallSouth() {
        this.grid.put(this.x, this.y + 1, wall);
    }

    wallEast() {
        this.grid.put(this.x + 1, this.y, wall);
    }

    wallWest() {
        this.grid.put(this.x - 1, this.y, wall);
    }
}

module.exports = {
    World
}