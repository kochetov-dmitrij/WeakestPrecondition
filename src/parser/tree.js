export class Tree {
    constructor(root) {
        this.root = root;
    }


}

export class AssignmentNode {
    constructor(params) {
        this.varLeft = params.varLeft;
        this.var1 = params.var1;
        this.var2 = params.var2;
        this.sign = params.sign;
        this.const1 = params.const1;
        this.const2 = params.const2;
        this.next = null;
    }

    setNext(nNext) {
        this.next = nNext;
    }
}

export class ConditionNode {
    constructor() {
        this.comparison = null;
        this.trueBranch = null;
        this.falseBranch = null;
        this.next = null;
    }

    setComparison(nComparison) {
        this.comparison = nComparison;
    }
}

export class CycleNode {
    constructor() {
        this.inv = null;
        this.body = null;
        this.comparison = null;
        this.next = null;
    }
}
