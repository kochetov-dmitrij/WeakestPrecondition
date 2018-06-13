// export class Tree {
//     constructor(root, exception) {
//         this.root = root;
//         this.exception = exception;
//     }
// }
//
// export class AssignmentNode {
//     constructor(params) {
//         this.varLeft = params.varLeft;
//         this.var1 = params.var1;
//         this.var2 = params.var2;
//         this.sign = params.sign;
//         this.const1 = params.const1;
//         this.const2 = params.const2;
//     }
//
//     setNext(next) {
//         this.next = next;
//         this.exception = next.exception;
//     }
// }
//
// export class ConditionNode {
//     constructor(params) {
//         this.var1 = params.var1;
//         this.var2 = params.var2;
//         this.sign = params.sign;
//         this.const1 = params.const1;
//         this.const2 = params.const2;
//         this.trueBranch = params.trueBranch;
//         this.falseBranch = params.falseBranch;
//     }
//
//     setNext(next) {
//         this.next = next;
//         this.exception = next.exception;
//     }
// }
//
// export class CycleNode {
//     constructor(params) {
//         this.invConst1 = params.invConst1;
//         this.invVar1 = params.invVar1;
//         this.invSign = params.invSign;
//         this.invConst2 = params.invConst2;
//         this.invVar2 = params.invVar2;
//         this.compConst1 = params.compConst1;
//         this.compVar1 = params.compVar1;
//         this.compSign = params.compSign;
//         this.compConst2 = params.compConst2;
//         this.compVar2= params.compVar2;
//         this.body = params.body;
//     }
//
//     setNext(next) {
//         this.next = next;
//         this.exception = next.exception;
//     }
// }
