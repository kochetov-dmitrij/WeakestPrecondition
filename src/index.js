import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



class Scroll extends React.Component{
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


class Transition extends React.Component{


    render() {
        return (
            <div>

            </div>
        )
    }
}



class ProgramBlock extends React.Component{

    printNode(node, alone) {

        let res = node.iscondition ?
            <div>

            </div>
        : node.iscycle ?
            <div>
                (WHINV {node.invVar1 ... .... } EOI {  {/*condition*/}   }
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





ReactDOM.render(<Scroll/>, document.getElementById('root'));
