class Digraph {
    constructor() {
        this.nodeToNodes = new Map();
    }

    addEdge(n1, n2) {
        const mappedTo = this.nodeToNodes.get(n1);

        if (mappedTo) {
            mappedTo.add(n2);
        } else {
            this.nodeToNodes.set(n1, new Set().add(n2));
        }

        return this;
    }

    addNode(n) {
        if (!this.nodeToNodes.has(n)) {
            this.nodeToNodes.set(n, new Set());
        }
    }

    *breadthFirstSearchFrom(start) {
        for (const node of this.childrenOf(start)) {
            yield node;
            yield* this.breadthFirstSearchFrom(node);
        }
    }

    childrenOf(n) {
        return this.nodeToNodes.get(n);
    }

    get entries() {
        return this.nodeToNodes.entries();
    }

    get nodes() {
        return this.nodeToNodes.keys();
    }
}

module.exports = {
    Digraph,
};
