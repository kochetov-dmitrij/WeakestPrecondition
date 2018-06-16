import React from 'react';
import style from './style.css';
import {} from './parser/parser'
import {AssignmentNode, ConditionNode, CycleNode} from "./parser/tree";


export class Scroll extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            transitions: [this.props.root]
        }
    }

    handleClick(node) {
        this.setState({
            transitions: this.state.transitions.concat([node])
        });
    }

    render() {

        const listItems = this.state.transitions.map((node) =>
            <div key={JSON.stringify(node)}>
                <Transition node={node} onClick={(nextNode) => this.handleClick(nextNode)}/>
            </div>
        );

        return (
            <div>
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
                    <ProgramBlock node={this.props.node} onClick={() => {}} extract={false}/>
                    <div className='eq'> = </div>
                    <ProgramBlock node={this.props.node} onClick={(nextNode) => this.props.onClick(nextNode)} extract={true}/>
                </div>
            </div>
        )
    }
}



export class ProgramBlock extends React.Component{

    printWP(node, extract) {
        const colors = getColor(node.index);
        const color = {
            backgroundColor: 'rgb(' + colors[0] + ',' + colors[1] + ',' + colors[2] + ')',
        };
        return (
            extract ?
                <div className="wp_wrapper">
                    wp{node.index}(
                    {this.printNode(node, extract)}
                    {node.next ? this.printWP(node.next, false) : ''}
                    )
                </div> :
                <div>
                    <button style={color} className='button_next_wp' onClick={() => this.props.onClick(node)}>
                        <div className="wp_wrapper">
                            wp{node.index}(
                        </div>
                        <div className='solid_program'>
                            {this.printNode(node, extract)}
                        </div>
                        <div className="wp_wrapper">
                            | ф)
                        </div>
                    </button>
                </div>
        )
    }

    printNode(node, extract) {
        
        let block = [node];
        // let next;
        if (!extract) {
            while (block[block.length - 1].next)
                block.push(block[block.length - 1].next);
        }

        block = block.map((node) => {
            if (node instanceof AssignmentNode) {

                let y = node.varLeft;
                let x1 = node.var1 ? node.var1 : node.const1;
                let sign = node.sign;
                let x2 = node.var2 ? node.var2 : node.const2;

                return (
                    <div key={JSON.stringify(node)}>
                        {y} := {x1}{sign ? (' ' + sign + ' ' + x2) : ''}
                    </div>
                )

            } else if (node instanceof CycleNode) {

                let inv1 = node.invVar1 ? node.invVar1 : node.invConst1;
                let invSign = node.invSign;
                let inv2 = node.invVar2 ? node.invVar2 : node.invConst2;
                let comp1 = node.compVar1 ? node.compVar1 : node.compConst1;
                let compSign = node.compSign;
                let comp2 = node.compVar2 ? node.compVar2 : node.compConst2;

                return (
                    extract ?
                        <div key={JSON.stringify(node)}>
                            ( ( {comp1} {compSign} {comp2} ) & ( {inv1} {invSign} {inv2} ) ->
                              {this.printWP(node.body, false)}
                              ) <br/>
                             &&<br/>
                              ( ! ( {comp1} {compSign} {comp2} ) & ( {inv1} {invSign} {inv2} ) -> ф )
                            )
                        </div>
                        :
                        <div key={JSON.stringify(node)}>
                            (WHINV {inv1} {invSign} {inv2} EOI {comp1} {compSign} {comp2} DO
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
                              {this.printWP(node.trueBranch, false)}
                            )<br />
                              && <br />
                            ( !( {comp1} {compSign} {comp2} ) ->
                              {this.printWP(node.falseBranch, false)}
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
            <div className="programBlock">
                {this.printWP(this.props.node, this.props.extract)}
            </div>
        )
    }
}

function getColor(number) {
    let left = 195;
    let right = 255;
    return [((number*30) % (right - left) + left).toString(), ((number*30 + 20) % (right - left) + left).toString(), ((number*30 + 40) % (right - left) + left).toString()];
}
