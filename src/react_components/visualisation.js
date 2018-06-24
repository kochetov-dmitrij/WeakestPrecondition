import React from 'react';
import '../styles/style.css'
import {AssignmentNode, ConditionNode, CycleNode, EmptyNode} from "../parser/tree";


export class Scroll extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            transitions: [this.props.root]
        }
    }

    substitutePrecondition(node) {                              
        let transitions = this.state.transitions;
        if (node === transitions[transitions.length - 1]) {
            transitions.pop();
            this.setState({
                transitions: transitions
            });
        } else {
            throw new Error('Replaced node isn\'t last');
        }

        node.setPrecondition();
        let precondition = node.precondition;

        if (node.parent instanceof ConditionNode) {
            putEmptyNode(node.parent.trueBranch, precondition);
            putEmptyNode(node.parent.falseBranch, precondition);
        }

        node.setEnablePrecondition(true);
    }

    handleClick(node) {
        let transitions = this.state.transitions;
        let parent = node.parent;
        let lastIndex = transitions.findIndex(n => n === parent);

        transitions = transitions.slice(0, lastIndex + 1).concat([node]);

        this.setState({
            transitions: transitions
        });
    }

    render() {
        const listItems = this.state.transitions.map((node) =>
            <div key={node.index}>
                <Transition
                    node={node}
                    substitutePrecondition={(node) => this.substitutePrecondition(node)}
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
        let node = this.props.node;

        return (
            <div className='transition_container'>
                <div className='transition'>
                    <ProgramBlock
                        node={node}
                        substitutePrecondition={(node) => this.props.substitutePrecondition(node)}
                        onClick={(nextNode) => this.props.onClick(nextNode)}
                        extract={false}
                    />
                    <div className='eq'> = </div>
                    {((node instanceof ConditionNode) && node.trueBranch.enablePrecondition && node.falseBranch.enablePrecondition ) ?
                        <ProgramBlock
                            node={node}
                            canSubstitute={true}
                            substitutePrecondition={(node) => this.props.substitutePrecondition(node)}
                            onClick={(nextNode) => this.props.onClick(nextNode)}
                            extract={true}
                        />
                        :
                        <ProgramBlock
                            node={node}
                            substitutePrecondition={(node) => this.props.substitutePrecondition(node)}
                            onClick={(nextNode) => this.props.onClick(nextNode)}
                            extract={true}
                        />
                    }
                    {(node instanceof AssignmentNode && !node.isLeaf() && node.next.enablePrecondition) ?
                        <div className='third_block'>
                            <div className='eq'> = </div>
                            <ProgramBlock
                                node={node}
                                canSubstitute={true}
                                substitutePrecondition={(node) => this.props.substitutePrecondition(node)}
                                onClick={(nextNode) => this.props.onClick(nextNode)}
                                extract={true}
                            />
                        </div>
                        :
                        ''
                    }
                </div>
            </div>
        )
    }
}


export class ProgramBlock extends React.Component{

    printWP(node, extract) {
        const clr = getColor(node.index);
        const color = {
            backgroundColor: clr,
        };
        const calculatedPreconditionColor = {
            'border-color': clr,
        };

        if (!node.precondition && (node.isLeaf() || this.props.canSubstitute)) node.setPrecondition();

        return (
            extract ?
                (node.isLeaf() || this.props.canSubstitute) ?
                    <div>
                        <div className="precondition">
                            {node.precondition}
                        </div>
                        {node.index > 1 ?
                            <button
                                className='substitute_button'
                                style={color}
                                onClick={() => this.props.substitutePrecondition(node)}>
                                    =Substitute all wp{node.index}=
                           </button> : ''
                        }
                    </div>
                    :
                    (node instanceof ConditionNode) ?
                        <div>
                            {this.printNode(node, extract)}
                        </div>
                        :
                        <div className="wp_wrapper">
                            wp{node.index}(
                                {this.printNode(node, extract)}
                            )
                        </div>
                :
                node.enablePrecondition ?
                    <div style={calculatedPreconditionColor}
                         className="calculated_precondition">
                            {node.precondition}
                    </div>
                    :
                    <button style={color} className='button_next_wp' onClick={() => this.props.onClick(node)}>
                        <div className="wp_wrapper">
                            wp{node.index}(
                        </div>
                        <div className='solid_program'>
                            {this.printNode(node, extract)}
                        </div>
                        <div className="wp_wrapper">
                            ; {getPostcondition(node)})
                        </div>
                    </button>
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
                    extract ?
                        <div key={node.index}>
                            {u} := {x1}{sign ? (' ' + sign + ' ' + x2) : ''} ;
                            {!node.isLeaf() ? <div style={{display:'inline-block'}}>{this.printWP(node.next, false)}</div> : ''}
                        </div>
                        :
                        <div key={node.index}>
                            {u} := {x1}{sign ? (' ' + sign + ' ' + x2) : ''} {node.next && !(node.next instanceof EmptyNode) ? ';':''}
                        </div>
                )

            } else if (node instanceof CycleNode) {

                let invariant = node.invariant;
                let comp1 = node.compVar1 ? node.compVar1 : node.compConst1;
                let compSign = node.compSign;
                let comp2 = node.compVar2 ? node.compVar2 : node.compConst2;

                return (
                    extract ?
                        <div key={node.index}>
                            {invariant}
                        </div>
                        :
                        <div key={node.index}>
                            (WIN {invariant} EOI {comp1} {compSign} {comp2} DO
                              {this.printNode(node.body, false)}
                            ) {node.next && !(node.next instanceof EmptyNode) ? ';':''}
                        </div>
                )

            } else if (node instanceof ConditionNode) {

                let comp1 = node.compVar1 ? node.compVar1 : node.compConst1;
                let compSign = node.compSign;
                let comp2 = node.compVar2 ? node.compVar2 : node.compConst2;
                let trueClr = getColor(node.trueBranch.index);
                const trueBranchColor = {
                    borderColor: trueClr,
                    background: hexToRGBA(trueClr, 0.15)
                };
                let flsClr = getColor(node.falseBranch.index);
                const falseBranchColor = {
                    borderColor: flsClr,
                    background: hexToRGBA(flsClr, 0.15)
                };

                return (
                    extract ?
                        <div key={node.index}>
                            <div className='branch_wrapper'>
                                ({comp1} {compSign} {comp2} ->
                                <div className='branch'>
                                    {node.trueBranch.enablePrecondition ? <div>&nbsp;{node.trueBranch.precondition}</div> :
                                        node.next.enablePrecondition ? this.printWP(node.trueBranch, false) :
                                            <div style={trueBranchColor}
                                                className='inactive_button'>
                                                     wp{node.trueBranch.index}(
                                                <div className='solid_program'>
                                                    {this.printNode(node.trueBranch, false)}
                                                </div>&nbsp;&nbsp;;
                                                {this.printWP(node.next, false)}
                                                )
                                            </div>
                                    }
                                </div>
                                )
                            </div> <br/>
                              && <br/>
                            <div className='branch_wrapper'>
                                (!({comp1} {compSign} {comp2}) ->
                                <div className='branch'>
                                    {node.falseBranch.enablePrecondition ? <div>&nbsp;{node.falseBranch.precondition}</div> :
                                        node.next.enablePrecondition ? this.printWP(node.falseBranch, false) :
                                            <div style={falseBranchColor}
                                                className='inactive_button'>
                                                    wp{node.falseBranch.index}(
                                                <div className='solid_program'>
                                                    {this.printNode(node.falseBranch, false)}
                                                </div>&nbsp;&nbsp;;
                                                {this.printWP(node.next, false)}
                                                )
                                            </div>
                                    }
                                </div>
                                )
                            </div>
                        </div>
                        :
                        <div key={node.index}>
                            (IF {comp1} {compSign} {comp2} THEN
                              {this.printNode(node.trueBranch, false)}
                            ELSE
                              {this.printNode(node.falseBranch, false)}
                            ) {node.next && !(node.next instanceof EmptyNode) ? ';':''}
                        </div>
                )
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

function getPostcondition(node) {
    do {
        node = node.next;
    } while (!(node instanceof EmptyNode));

    return node.precondition;
}

export function putEmptyNode(node, precondition) {
    while (node.next) node = node.next;
    if (node instanceof ConditionNode) {
        putEmptyNode(node.trueBranch, precondition);
        putEmptyNode(node.falseBranch, precondition);
    }
    let emptyNode = new EmptyNode();
    emptyNode.setPrecondition(precondition);
    node.next = emptyNode;
}

function hexToRGBA(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
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
