import React from 'react';
import '../styles/style.css'
import {AssignmentNode, ConditionNode, CycleNode} from "../parser/tree";


export class Scroll extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            transitions: [this.props.root]
        }
    }

    replaceSolved(node) {
        let transitions = this.state.transitions;
        if (node === transitions[transitions.length - 1]) {
            this.setState({
                transitions: transitions.pop()
            });
        } else {
            throw new Error('Replaced node isn\'t last');
        }
    }

    handleClick(node) {
        let transitions = this.state.transitions;
        let parentIndex = node.parentIndex;
        let lastIndex = transitions.findIndex(n => n.index === parentIndex);

        transitions = transitions.slice(0, lastIndex + 1).concat([node]);

        this.setState({
            transitions: transitions
        });
    }

    render() {
        const listItems = this.state.transitions.map((node) =>
            <div key={JSON.stringify(node)}>
                <Transition
                    node={node}
                    postCondition={this.props.postCondition}
                    onClick={(nextNode) => this.handleClick(nextNode)}
                />
            </div>
        );

        return (
            <div>
                <button className='button' onClick={() => this.props.onBack()}>
                    &lt;= BACK
                </button>
                {listItems}
            </div>
        )
    }
}


export class Transition extends React.Component{
    render() {
        return (
            <div className='transition_container'>
                <div className='transition'>
                    <ProgramBlock
                        node={this.props.node}
                        postCondition={this.props.postCondition}
                        onClick={(nextNode) => this.props.onClick(nextNode)}
                        extract={false}
                    />
                    <div className='eq'> = </div>
                    <ProgramBlock
                        node={this.props.node}
                        postCondition={this.props.postCondition}
                        onClick={(nextNode) => this.props.onClick(nextNode)}
                        extract={true}
                    />
                </div>
            </div>
        )
    }
}


export class ProgramBlock extends React.Component{
    printWP(node, extract, postCondition) {
        const color = {
            backgroundColor: getColor(node.index),
        };

        if (node.isLeaf() && !node.precondition) {
            node.setPrecondition(this.props.postCondition);
        }

        return (
            extract ?
                (node.enablePrecondition || node.isLeaf()) ?
                    <div className="precondition">
                        {node.precondition}
                        {node.index > 1 ? <button>^</button> : ''}
                    </div>
                    :
                    <div className="wp_wrapper">
                        wp{node.index}(
                        {this.printNode(node, extract)}
                        {/*{node.next ? this.printWP(node.next, false) : ''}*/}
                        )
                    </div>
                :
                <div>
                    <button style={color} className='button_next_wp' onClick={() => this.props.onClick(node)}>
                        <div className="wp_wrapper">
                            wp{node.index}(
                        </div>
                        <div className='solid_program'>
                            {this.printNode(node, extract)}
                        </div>
                        <div className="wp_wrapper">
                            | {this.props.postCondition})
                        </div>
                    </button>
                </div>
        )
    }

    printNode(node, extract) {
        let block = [node];
        if (!extract) {
            while (block[block.length - 1].next)
                block.push(block[block.length - 1].next);
        }

        block = block.map((node) => {
            if (node instanceof AssignmentNode) {

                let u = node.varLeft;
                let x1 = node.var1 ? node.var1 : node.const1;
                let sign = node.sign;
                let x2 = node.var2 ? node.var2 : node.const2;

                return (
                    <div key={JSON.stringify(node)}>
                        {u} := {x1}{sign ? (' ' + sign + ' ' + x2) : ''}
                    </div>
                )

            } else if (node instanceof CycleNode) {

                let invariant = node.invariant;
                let comp1 = node.compVar1 ? node.compVar1 : node.compConst1;
                let compSign = node.compSign;
                let comp2 = node.compVar2 ? node.compVar2 : node.compConst2;

                return (
                    extract ?
                        <div key={JSON.stringify(node)}>
                            {invariant}
                        </div>
                        :
                        <div key={JSON.stringify(node)}>
                            (WIN {invariant} EOI {comp1} {compSign} {comp2} DO
                              {this.printNode(node.body, false)}
                            )
                        </div>
                )

            } else if (node instanceof ConditionNode) {

                let comp1 = node.compVar1 ? node.compVar1 : node.compConst1;
                let compSign = node.compSign;
                let comp2 = node.compVar2 ? node.compVar2 : node.compConst2;

                return (
                    extract ?
                        <div key={JSON.stringify(node)}>
                            ( {comp1} {compSign} {comp2} ->
                                {node.trueBranch.enablePrecondition ? node.trueBranch.precondition :
                                    !node.next ? this.printWP(node.trueBranch, false, this.props.postCondition) :
                                        node.next.enablePrecondition ? this.printWP(node.trueBranch, false, node.next.precondition) :
                                            <div> wp{node.trueBranch.index}( <br/>
                                                {this.printNode(node.trueBranch, false)} <br/>
                                                {this.printWP(node.trueBranch, false, this.props.postCondition)} <br/>
                                                )
                                            </div>
                                }
                            )<br />
                              && <br />
                            ( !( {comp1} {compSign} {comp2} ) ->
                                {node.falseBranch.enablePrecondition ? node.falseBranch.precondition :
                                    !node.next ? this.printWP(node.falseBranch, false, this.props.postCondition) :
                                        node.next.enablePrecondition ? this.printWP(node.falseBranch, false, node.next.precondition) :
                                            <div> wp{node.falseBranch.index}( <br/>
                                                {this.printNode(node.falseBranch, false)} <br/>
                                                {this.printWP(node.falseBranch, false, this.props.postCondition)} <br/>
                                                )
                                            </div>
                                }
                            )
                        </div>
                        :
                        <div key={JSON.stringify(node)}>
                            (IF {comp1} {compSign} {comp2} THEN
                              {this.printNode(node.trueBranch, false)}
                            ELSE
                              {this.printNode(node.falseBranch, false)}
                            )
                        </div>
                )

            } else {
                throw new Error('Unexpected class of node: \'' + node.constructor.name + '\'')
            }
        });

        return (
            <div className="block">
                {block}
            </div>
        )
    }

    render() {
        return (
            <div className="program_block">
                {this.printWP(this.props.node, this.props.extract)}
            </div>
        )
    }
}


function getColor(number) {
    switch (number % 12) {
        case 0: return '#505090';
        case 1: return '#509050';
        case 2: return '#905050';
        case 3: return '#509090';
        case 4: return '#905090';
        case 5: return '#909050';
        case 6: return '#303070';
        case 7: return '#307030';
        case 8: return '#703030';
        case 9: return '#307070';
        case 10: return '#703070';
        case 11: return '#707030';
        default: return
    }
}
