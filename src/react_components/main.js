import React from 'react';
import '../styles/style.css';
import {parse} from '../parser/parser'
import {Scroll} from './visualisation';
import {CodeForm, ExceptionBlock} from './parsing';


export class MainComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            tree: null,
            program: ''
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
        if (this.state.tree && !this.state.tree.exception) {

            return (
                <Scroll root={this.state.tree.root}/>
            )

        } else {

            return (
                <div className='parser_block'>
                    <CodeForm
                        codeText={this.state.program}
                        onChange={(e) => this.handleChange(e)}
                        onSubmit={(e) => this.handleSubmit(e)}
                    />

                    {this.state.tree ?
                        <ExceptionBlock
                            exception={this.state.tree.exception}
                            program={this.state.submittedProgram}
                            exceptionPosition={this.state.tree.exceptionPosition}
                        /> : ''
                    }
                </div>
            )

        }
    }
}