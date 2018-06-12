//import {AssignmentNode} from "./tree";

function parseAsConst(program) {
    let regexConst = /^\s*(-?[0-9]+)(.+)$/;
    let res = program.match(regexConst);
    // return {
    //     parsed: res ? res[0] : null,
    //     remaining: res ? program.slice(res[0].length, program.length - 1) : null
    // };
    if (res) res.shift();
    return res;
}

function parseAsVariable(program) {
    let regexVariable = /^\s*([a-z][a-z0-9]*)(.+)$/;
    let res = program.match(regexVariable);
    // return {
    //     parsed: res ? res[0] : null,
    //     remaining: res ? program.slice(res[0].length, program.length - 1) : null
    // };
    if (res) res.shift();
    return res;
}

function parseAsVariableOrConstant(program) {
    let variable = parseAsVariable(program);
    let constant = parseAsConst(program);

    // if (!(variable || constant)) exception

    return variable ? {program: variable[1], value: variable[0], type: 'variable'} : {program: constant[1], value: constant[0], type: 'constant'};
}

function parseAsAssignment(program) {
    let res;

    let regexExpression1 = /^\s*(.+)$/;
    res = program.match(regexExpression1);
    // if (!res) return null;
    program = res[1];

    res = parseAsVariable(program);
    let varLeft = res[0];
    program = res[1];

    let regexExpression2 = /^\s*:\s*=(.+)$/;
    res = program.match(regexExpression2);
    // if (!res) return null;
    program = res[1];


    res = parseAsVariableOrConstant(program);
    // if (!res) return null;
    let var1 = null, const1 = null;
    if (res.type === 'variable') {
        var1 = res.value;
    } else {
        const1 = res.value;
    }
    program = res.program;

    let regexExpression3 = /^\s*([*+-])?(.+)$/;
    res = program.match(regexExpression3);
    // if (!res) return null;
    let sign = res[1] ? res[1] : null;
    program = res[2];


    let var2 = null, const2 = null;
    if (sign) {
        res = parseAsVariableOrConstant(program);
        // if (!res) return null;
        //  ================ .res[0]/.res[0]
        if (res.type === 'variable') {
            var2 = res.value;
        } else {
            const2 = res.value;
        }
        program = res.program;
    }

    let assignmentNode = AssignmentNode({
        varLeft: varLeft,
        var1: var1,
        var2: var2,
        sign: sign,
        const1: const1,
        const2: const2,
    });

    console.log('You done now');


    return program;
}


/**
 * An argument is a remainder of the program,
 * returns nextNode and remainder of the program without an operator in the nextNode
 */
function parseNextNode(program, semicolon) {

    if (semicolon) {
        let regexExpression1 = /^\s+;\s+(.+)$/;
        let res = program.match(regexExpression1);
        // if (!res) return null;
        program = res[1];
    }

    // let regexAssignment = /^\s*[a-z]+\s*:\s*=\s*[a-z]+\s*(\s*|;)\s*/g;
    // if (program.)
    // let flag = null;
    // i = 0;
    // while (!flag) {
    //     if (program[i] == ) {
    //
    //     }
    //     ++i;
    // }

}

/**
 * parse all program
 * returns a tree of Nodes
 */
function parse(program) {
    program = program.replace(/\s\s+/g, ' ');
    do {
        const res = parseNextNode(program);
        program = res.program;
        const nextNode = res.program;
    } while (program.replace(/\s\s+/g, '') !== '');

}

// alert(
//     parseAsExpression(
//
//     )
// );

parseAsAssignment("   x :  = 2  ; program");