import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import {parse} from './parser/parser'
import {ProgramBlock, Transition, Scroll} from './render_tree'

class MainComponent extends React.Component {
    constructor() {
        super();
        this.state = {tree: null, program: null};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event, val) {
        let tree = qq(val);
        this.setState({
            tree: tree,
            program: val,
        });
        event.preventDefault();
    }

    render() {
        if (this.state.tree) {
            if (this.state.tree.exception) {
                return (
                    <div>
                        <h2>{this.state.tree.exception}: {getSnippet(this.state.program, this.state.tree.excPosFromEnd)}</h2>
                        <CodeForm defaultText={this.state.program} onSubmit={(e, val) => this.handleSubmit(e, val)} />
                    </div>
                );
            }
            else {
                console.log(this.state.tree.root);
                return <Scroll root={this.state.tree.root} />;
            }
        }
        else {
            return <CodeForm defaultText={this.state.program} onSubmit={(e, val) => this.handleSubmit(e, val)}/>;
        }
    }
}

class CodeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: props.program ? props.program : 'Enter your code here'};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    // handleSubmit(event) {
    //     tree = qq(this.state.value);
    //     event.preventDefault();
    // }

    render() {
        return (
            <form onSubmit={(e) => this.props.onSubmit(e, this.state.value)}>
                <textarea name="code" value={this.state.value} onChange={(e) => this.handleChange(e)} />
                <input type="submit" value="Run" />
            </form>
        );
    }
}

ReactDOM.render( <MainComponent />, document.getElementById('root'));

// ReactDOM.render(<Scroll
//     root={qq().root}
// />, document.getElementById('root'));

function getSnippet(program, ind) {
    ind = program.length - ind;
    let left = Math.max(0, ind - 10);
    let right = Math.min(ind + 10, program.length);
    return <pre className="code">{program.slice(left, ind)}<code className="error_letter">{program[ind]}</code>{program.slice(ind + 1, right)}</pre>;
}

function qq(textCode){
    return parse(textCode);
}