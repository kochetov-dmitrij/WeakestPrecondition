import React from 'react';
import '../styles/style.css';
import {parseProgram} from '../parser/programParser'
import {Scroll} from './visualisation';
import {CodeForm, ExceptionBlock} from './parsing';
import {parseFormula} from "../parser/formulaParser";


export class MainComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            tree: null,
            program: '',
            parsedPostCondition: null,
            postCondition: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCondition = this.handleChangeCondition.bind(this);
    }

    handleSubmit(e) {
        let tree = parseProgram(this.state.program);
        let parsedPostCondition = parseFormula(this.state.postCondition);
        this.setState({
            tree: tree,
            submittedProgram: this.state.program,
            parsedPostCondition: parsedPostCondition,
            submittedPostCondition: this.state.postCondition,
        });
        e.preventDefault();
    }

    handleChange(e) {
        this.setState({
            program: e.target.value,
        });
    }

    handleChangeCondition(e) {
        this.setState({
            postCondition: e.target.value,
        });
    }

    handleBack(e) {
        this.setState({
            tree: null,
        });
    }

    render() {
        if (this.state.tree && !this.state.tree.exception && this.state.parsedPostCondition && !this.state.parsedPostCondition.exception) {

            return (
                <Scroll
                    root={this.state.tree.root}
                    postCondition={this.state.parsedPostCondition.formula}
                    onBack={() => this.handleBack()}
                />
            )

        } else {

            return (
                <div className='parser_block'>
                    <CodeForm
                        codeText={this.state.program}
                        postCondition={this.state.postCondition}
                        onChange={(e) => this.handleChange(e)}
                        onSubmit={(e) => this.handleSubmit(e)}
                        onChangeCondition={(e) => this.handleChangeCondition(e)}
                    />

                    {this.state.tree && this.state.tree.exception?
                        <ExceptionBlock
                            exception={this.state.tree.exception}
                            program={this.state.submittedProgram}
                            exceptionPosition={this.state.tree.exceptionPosition}
                        /> : ''
                    }

                    {this.state.parsedPostCondition && this.state.parsedPostCondition.exception ?
                        <ExceptionBlock
                            exception={this.state.parsedPostCondition.exception}
                            program={this.state.submittedPostCondition}
                            exceptionPosition={this.state.parsedPostCondition.exceptionPosition}
                        /> : ''
                    }
                </div>
            )

        }
    }
}