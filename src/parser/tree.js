/**
 * A Parsed program in a connected nodes representation
 */
export class Tree {
    constructor(params) {
        this.root = params.root;
        this.exception = params.exception;
        this.excPosFromEnd = params.excPosFromEnd;
    }
}

/**
 * <AssignmentNode> ::=
 *   <assignment> ::= <variable> <bln> : = <bln> <expression>
 */
export class AssignmentNode {
    constructor(params) {
        this.varLeft = params.varLeft;
        this.var1 = params.var1;
        this.var2 = params.var2;
        this.sign = params.sign;
        this.const1 = params.const1;
        this.const2 = params.const2;
    }

    setNext(next) {
        this.next = next;
        this.exception = next.exception;
    }
}

/**
 * <ConditionNode> ::=
 *   ( <bln> IF <n/s> <spc> <comparison> <spc> <n/s> THEN <n/s> <program> <n/s> ELSE <n/s> <program> <n/s> )
 */
export class ConditionNode {
    constructor(params) {
        this.compVar1 = params.compVar1;
        this.compVar2 = params.compVar2;
        this.compSign = params.compSign;
        this.compConst1 = params.compConst1;
        this.compConst2 = params.compConst2;
        this.trueBranch = params.trueBranch;
        this.falseBranch = params.falseBranch;
    }

    setNext(next) {
        this.next = next;
        this.exception = next.exception;
    }
}

/**
 * <CycleNode> ::=
 *   ( <bln> WHINV <n/s> <spc> <comparison> <spc> <n/s> EOI <n/s> <spc> <comparison> <spc> <n/s> DO <n/s> <program> <n/s> )
 */
export class CycleNode {
    constructor(params) {
        this.invConst1 = params.invConst1;
        this.invVar1 = params.invVar1;
        this.invSign = params.invSign;
        this.invConst2 = params.invConst2;
        this.invVar2 = params.invVar2;
        this.compConst1 = params.compConst1;
        this.compVar1 = params.compVar1;
        this.compSign = params.compSign;
        this.compConst2 = params.compConst2;
        this.compVar2= params.compVar2;
        this.body = params.body;
    }

    setNext(next) {
        this.next = next;
        this.exception = next.exception;
    }
}