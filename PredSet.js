class PredSet {
    constructor(pred) {
        this.pred = pred;
        this.set = [];
    }

    clone() {
        const p = new PredSet(this.pred);
        p.set = this.set.slice();
        return p;
    }

    has(val) {
        return this.set.filter(alreadyIn => this.pred(val, alreadyIn))
            .reduce((bool, nextBool) => bool || nextBool, false);
    }

    put(val) {
        if (this.has(val)) return;

        this.set.push(val);
    }
}

module.exports = {
    PredSet
}