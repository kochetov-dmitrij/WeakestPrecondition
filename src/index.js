import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import {parse} from './parser/parser'
import {ProgramBlock, Transition, Scroll} from './render_tree'

class MainComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            tree: null,
            program:  'Enter your code here'
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        let tree = parse(this.state.program);
        this.setState({
            tree: tree,
            submittedProgram: this.state.program
        });
        event.preventDefault();
    }

    handleChange(e) {
        this.setState({
            program: e.target.value,
        });
    }

    render() {
        if (this.state.tree) {
            if (this.state.tree.exception) {
                return (
                    <div className='parser'>
                        <CodeForm codeText={this.state.program} onChange={(e) => this.handleChange(e)} onSubmit={(e) => this.handleSubmit(e)} />
                        <div className='exception_block'>
                            <div className='exception_message'>
                                {this.state.tree.exception + ':'}
                            </div>
                            {getSnippet(this.state.submittedProgram, this.state.tree.exceptionPosition)}
                        </div>
                    </div>
                );
            }
            else {
                console.log(this.state.tree.root);
                return <Scroll root={this.state.tree.root} />;
            }
        }
        else {
            return <CodeForm codeText={this.state.program} onChange={(e) => this.handleChange(e)} onSubmit={(e) => this.handleSubmit(e)}/>;
        }
    }
}

class CodeForm extends React.Component {

    render() {
        return (
            <form className="submit_form" onSubmit={(e) => this.props.onSubmit(e)}>
                <textarea className='submit_area' name="code" value={this.props.codeText} onChange={(e) => this.props.onChange(e)} />
                <input className='submit_button' type="submit" value="Run" />
            </form>
        );
    }
}

ReactDOM.render( <MainComponent />, document.getElementById('root'));

function getSnippet(program, ind) {

    while (ind < program.length && (program[ind] === '\n' || program[ind] === ' ')) ind++;
    let letter = (!program[ind] || program[ind] === '\n') ? " " : program[ind];
    let leftPart = program.slice(0, ind).match(/[\r\n]?([^\r\n]*[\r\n]?[^\r\n]*)$/)[1];
    let rightPart = program.slice(ind + 1, program.length).match(/^([^\r\n]*[\r\n]?[^\r\n]*)[\r\n]?/)[1];

    return <pre className="code">{leftPart}<code className="error_letter">{letter}</code>{rightPart}</pre>;
}