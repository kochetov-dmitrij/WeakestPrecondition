import React from 'react';
import '../styles/style.css';


export class CodeForm extends React.Component {
    render() {
        return (
            <form className='submit_form' onSubmit={(e) => this.props.onSubmit(e)}>
                <textarea
                    className='area'
                    wrap="off"
                    rows={30}
                    spellCheck='false'
                    placeholder='Enter your code here'
                    name='code'
                    value={this.props.codeText}
                    onChange={(e) => this.props.onChange(e)}
                />
                <textarea
                    className='area'
                    rows={3}
                    spellCheck='false'
                    placeholder='Enter post condition for the program here'
                    name='condition'
                    value={this.props.postCondition}
                    onChange={(e) => this.props.onChangeCondition(e)}
                />
                <input
                    className='button'
                    type='submit'
                    value='Visualise calculating of the weakest precondition'
                />
            </form>
        );
    }
}


export class ExceptionBlock extends React.Component {
    render() {
        return (
            <div className='exception_block'>
                <div className='message'>
                    {this.props.exception}
                </div>
                {getSnippet(this.props.program, this.props.exceptionPosition)}
            </div>
        )
    }
}


function getSnippet(program, ind) {
    while (ind < program.length && (program[ind] === '\n' || program[ind] === ' ')) ind++;
    let letter = (!program[ind] || program[ind] === '\n') ? ' ' : program[ind];
    let leftPart = program.slice(0, ind).match(/[\r\n]?([^\r\n]*[\r\n]?[^\r\n]*)$/)[1];
    let rightPart = program.slice(ind + 1, program.length).match(/^([^\r\n]*[\r\n]?[^\r\n]*)[\r\n]?/)[1];

    return <pre className='code'>{leftPart}<code className='letter'>{letter}</code>{rightPart}</pre>;
}