// import React from 'react';
// import './index.css';
// import {} from './parser/parser'
// import {AssignmentNode, ConditionNode, CycleNode} from "./parser/tree";


// export class Scroll extends React.Component{
//     constructor(props) {
//         super(props);
//         this.state = {
//             transitions: [/*root*/]
//         }
//     }
//
//     render() {
//
//         const listItems = this.state.transitions.map((/*parameters*/) =>
//             <li>
//                 <Transition {/*parameters*/} />
//             </li>
//         );
//
//         return (
//             <div>
//                 {listItems}
//             </div>
//         )
//     }
// }
//
//
// export class Transition extends React.Component{
//
//
//     render() {
//         return (
//             <div>
//
//             </div>
//         )
//     }
// }
//
//
//
// export class ProgramBlock extends React.Component{
//
//     printNode(node, alone) {
//
//         let res;
//
//         if (node instanceof AssignmentNode) {
//
//             let y = node.varLeft;
//             let x1 = node.var1 ? node.var1 : node.const1;
//             let sign = node.sign;
//             let x2 = node.var2 ? node.var2 : node.const2;
//
//             res =
//                 <div>
//                     {y} := {x1}{sign ? (' ' + sign + ' ' + x2) : ''}
//                 </div>
//         } else if (node instanceof CycleNode) {
//
//             let inv1 = node.invVar1 ? node.invVar1 : node.invConst1;
//             let invSign = node.invSign;
//             let inv2 = node.invVar2 ? node.invVar2 : node.invConst2;
//             let comp1 = node.compVar1 ? node.compVar1 : node.compConst1;
//             let compSign = node.compSign;
//             let comp2 = node.compVar2 ? node.compVar2 : node.compConst2;
//
//             res =
//                 <div>
//                     (WHINV {inv1} {invSign} {inv2} EOI {comp1} {compSign} {comp2} DO
//                       {!alone ? printNode(node.body) : <ProgramBlock node={node.body} alone={false}/>}
//                     )
//                 </div>
//         }
//
//             : (node instanceof ConditionNode) ?
//             <div>
//
//             </div> : ;
//
//         if (!alone) res += printNode(node.next, false);
//
//         return res;
//     }
//
//     render() {
//         return (
//             <div>
//                 {printNode(this.props.node, this.props.alone)}
//             </div>
//         )
//     }
// }
