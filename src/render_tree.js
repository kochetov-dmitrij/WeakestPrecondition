import React from 'react';
import './index.css';
import {} from './parser/parser'


export class Scroll extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            transitions: [/*root*/]
        }
    }

    render() {

        const listItems = this.state.transitions.map((/*parameters*/) =>
            <li>
                <Transition {/*parameters*/} />
            </li>
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
            <div>

            </div>
        )
    }
}



export class ProgramBlock extends React.Component{

    printNode(node, alone) {

        let res = node.iscondition ?
            <div>

            </div>
            : node.iscycle ?
                <div>
                    (WHINV {node.invVar1 } EOI {  {/*condition*/}   }
                    DO
                    {!alone ? printNode(node.body) : <ProgramBlock node={node.body} alone={false}/>}
                    )
                </div>
                :   <div>

                </div>;

        if (!alone) res += printNode(node.next, false);

        return res;
    }

    render() {
        return (
            <div>
                {printNode(this.props.node, this.props.alone)}
            </div>
        )
    }
}
