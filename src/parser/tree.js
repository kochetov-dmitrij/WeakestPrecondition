/**
 * A Parsed program in a connected nodes representation
 */
export class Tree {
    constructor(params) {
        this.root = params.root;
        this.exception = params.exception;
        this.exceptionPosition = params.exceptionPosition;
    }

    setNumberOfNodes(numberOfNodes) {
        this.numberOfNodes = numberOfNodes;
    }
}

class Node {
    constructor() {
        this.enablePrecondition = false;
        this.precondition = null;
    }

    setNext(next) {
        this.next = next;
        this.exception = next.exception;
    }

    setIndex(index, parentIndex) {
        this.index = index;
        this.parentIndex = parentIndex;
    }

    setEnablePrecondition(bool) {
        this.enablePrecondition = bool;
    }
}

/**
 * <AssignmentNode> ::=
 *   <assignment> ::= <variable> <bln> : = <bln> <expression>
 */
export class AssignmentNode extends Node {
    constructor(params) {
        super();
        this.varLeft = params.varLeft;
        this.var1 = params.var1;
        this.var2 = params.var2;
        this.sign = params.sign;
        this.const1 = params.const1;
        this.const2 = params.const2;
        this.parentIndex = params.parentIndex;
    }

    isLeaf() {
        return !this.next;
    }

    setPrecondition(postCondition) {

        if (!this.canEnablePrecondition()) throw new Error('Can\'t enable precondition for the AssignmentNode, children aren\'t calculated');

        if (this.next) postCondition = this.next.precondition;

        let var1 = this.var1;
        let var2 = this.var2;
        let sign = this.sign;
        let const1 = this.const1;
        let const2 = this.const2;

        let varLeft = new RegExp(this.varLeft);
        let rightPart = (var1 ? var1 : const1) + sign ? ' ' + sign + ' ' + (var2 ? var2 : const2) : '';
        this.precondition = postCondition.replace(varLeft, '(' + rightPart + ')');

        this.setEnablePrecondition(true);
    }

    canEnablePrecondition() {
        return (!this.next) || (this.next && this.next.enablePrecondition);
    }
}

/**
 * <ConditionNode> ::=
 *   ( <bln> IF <n/s> <spc> <comparison> <spc> <n/s> THEN <n/s> <program> <n/s> ELSE <n/s> <program> <n/s> )
 */
export class ConditionNode extends Node {
    constructor(params) {
        super();
        this.compVar1 = params.compVar1;
        this.compVar2 = params.compVar2;
        this.compSign = params.compSign;
        this.compConst1 = params.compConst1;
        this.compConst2 = params.compConst2;
        this.trueBranch = params.trueBranch;
        this.falseBranch = params.falseBranch;
        this.parentIndex = params.parentIndex;
    }

    isLeaf() {
        return !(this.next || this.trueBranch || this.falseBranch);
    }

    setPrecondition(postCondition) {

        if (!this.canEnablePrecondition()) throw new Error('Can\'t enable precondition for the ConditionNode, children aren\'t calculated');

        let compVar1 = this.compVar1;
        let compVar2 = this.compVar2;
        let compSign = this.compSign;
        let compConst1 = this.compConst1;
        let compConst2 = this.compConst2;
        let trueBranch = this.trueBranch;
        let falseBranch = this.falseBranch;
        let next = this.next;

        // this.precondition = '(' + compVar1 ? compVar1 : compConst1 + ' ' + compSign + ' ' + trueBranch ? trueBranch.precondition : ;

        this.setEnablePrecondition(true);
    }

    canEnablePrecondition() {
        return (!this.trueBranch && !this.falseBranch) ||
            (!this.trueBranch && this.falseBranch && this.falseBranch.enablePrecondition) ||
            (this.trueBranch && this.trueBranch.enablePrecondition && !this.falseBranch) ||
            (this.falseBranch && this.falseBranch.enablePrecondition && this.trueBranch && this.trueBranch.enablePrecondition);
    }
}

/**
 * <CycleNode> ::=
 *   ( <bln> WHINV <n/s> <spc> <comparison> <spc> <n/s> EOI <n/s> <spc> <comparison> <spc> <n/s> DO <n/s> <program> <n/s> )
 */
export class CycleNode extends Node {
    constructor(params) {
        super();
        this.invariant = params.invariant;
        this.compConst1 = params.compConst1;
        this.compVar1 = params.compVar1;
        this.compSign = params.compSign;
        this.compConst2 = params.compConst2;
        this.compVar2= params.compVar2;
        this.body = params.body;
        this.index = params.index;
        this.parentIndex = params.parentIndex;
    }

    isLeaf() {
        return true;
    }

    setPrecondition(postCondition) {
        this.precondition = this.invariant;
        this.setEnablePrecondition(true);
    }

    canEnablePrecondition() {
        return true;
    }
}