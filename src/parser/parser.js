class Tree {
    constructor(root, exception, exceptionPos) {
        this.root = root;
        this.exception = exception;
        this.exceptionPos = exceptionPos;
    }
}

class AssignmentNode {
    constructor(params) {
        this.varLeft = params.varLeft;
        this.var1 = params.var1;
        this.var2 = params.var2;
        this.sign = params.sign;
        this.const1 = params.const1;
        this.const2 = params.const2;
    }

    setNext(next) {
        this.next = next;
        this.exception = next.exception;
    }
}

class ConditionNode {
    constructor(params) {
        this.compVar1 = params.compVar1;
        this.compVar2 = params.compVar2;
        this.compSign = params.compSign;
        this.compConst1 = params.compConst1;
        this.compConst2 = params.compConst2;
        this.trueBranch = params.trueBranch;
        this.falseBranch = params.falseBranch;
    }

    setNext(next) {
        this.next = next;
        this.exception = next.exception;
    }
}

class CycleNode {
    constructor(params) {
        this.invConst1 = params.invConst1;
        this.invVar1 = params.invVar1;
        this.invSign = params.invSign;
        this.invConst2 = params.invConst2;
        this.invVar2 = params.invVar2;
        this.compConst1 = params.compConst1;
        this.compVar1 = params.compVar1;
        this.compSign = params.compSign;
        this.compConst2 = params.compConst2;
        this.compVar2= params.compVar2;
        this.body = params.body;
    }

    setNext(next) {
        this.next = next;
        this.exception = next.exception;
    }
}

/**
 * <expression_sign> ::= * |
 *                       + |
 *                       -
 *
 * <comparison_sign> ::= = |
 *                       > |
 *                       < |
 *                       ~= |
 *                       >= |
 *                       <=
 */

/**
 * <constant>
 *
 * @param {string} program - Program source. Token is going to be found at the beginning of the program
 * @returns {*}
 *      =======================|==============\ token found /================|=========\ token not found /==========
 *      {string} constant      | Found constant                              | null
 *      {string} program       | The rest of the program without found token | null
 *      {string} exception     | null                                        | Exception message
 *      {number} excPosFromEnd | null                                        | Number of chars between the end of
 *                             |                                             |   the program and the exception
 */
function parseAsConstant(program) {
    let regexConst = /^\s*(-?[0-9]+)([^a-z][\s\S]*)$/;
    let res = program.match(regexConst);
    return res ? {
        constant: res[1],
        program: res[2]
    } : {
        exception: 'Expected a constant',
        excPosFromEnd: program.length
    }
}


/**
 * <variable>
 *
 * @param {string} program - Program source. Token is going to be found at the beginning of the program
 * @returns {*}
 *      =======================|==============\ token found /================|=========\ token not found /==============
 *      {string} variable      | Found variable                              | null
 *      {string} program       | The rest of the program without found token | null
 *      {string} exception     | null                                        | Exception message
 *      {number} excPosFromEnd | null                                        | Number of chars between the end of
 *                             |                                             |   the program and the exception
 */
function parseAsVariable(program) {
    let regexVariable = /^\s*([a-z][a-z0-9]*)([^a-z0-9][\s\S]*)$/;
    let res = program.match(regexVariable);
    return res ? {
        variable: res[1],
        program: res[2]
    } : {
        exception: 'Expected a variable',
        excPosFromEnd: program.length
    }
}


/**
 * <const_or_var> ::= <variable> |
 *                    <constant>
 *
 * @param {string} program - Program source. Token is going to be found at the beginning of the program
 * @returns {*}
 *      =======================|===\ variable found /==|=\ constant found /===|=========\ token not found /=============
 *      {string} constant      | null                  | Found constant       | null
 *      {string} variable      | Found variable        | null                 | null
 *      {string} program       | The rest of the program without found token  | null
 *      {string} exception     | null                  | null                 | Exception message
 *      {number} excPosFromEnd | null                  | null                 | Number of chars between the end of
 *                             |                       |                      |   the program and the exception
 */
function parseAsVariableOrConstant(program) {
    return parseBestOption(
        [
            () => parseAsVariable(program),
            () => parseAsConstant(program),
        ],
        'Expected a variable or constant'
    );
}


/**
 * <expression> ::= <const_or_var> |
 *                  <const_or_var> <bln> <operation> <bln> <const_or_var>
 *
 * @param {string} program - Program source. Token is going to be found at the beginning of the program
 * @returns {*}
 *      =======================|=======\ single /======|========\ double/======|=====\ token not found /================
 *      {string} var1 / const1 | <const_or_var>        | <const_or_var>        | null
 *      {string} sign          | null                  | <expression_sign>     | null
 *      {string} var2 / const2 | null                  | <const_or_var>        | null
 *      {string} program       | The rest of the program without found token   | null
 *      {string} exception     | null                  | null                  | Exception message
 *      {number} excPosFromEnd | null                  | null                  | Number of chars between the end of
 *                             |                       |                       |   the program and the exception
 */
function parseAsExpression(program) {

    let res, var1, const1, sign, var2, const2;

    // remove spaces before expression
    let regexExpression1 = /^\s*([\s\S]*)$/;
    res = program.match(regexExpression1);
    program = res[1];


    res = parseAsVariableOrConstant(program);
    if (res.exception) return res;
    var1 = res.variable;
    const1 = res.constant;
    program = res.program;


    let regexExpression3 = /^\s*([*+-])?([\s\S]*)$/;
    res = program.match(regexExpression3);
    sign = res[1] ? res[1] : null;
    if (sign) program = res[2];


    if (sign) {
        res = parseAsVariableOrConstant(program);
        if (res.exception) return res;
        var2 = res.variable;
        const2 = res.constant;
        program = res.program;
    }

    return({
        const1: const1,
        var1: var1,
        sign: sign,
        const2: const2,
        var2: var2,
        program: program
    });
}


/**
 * <assignment> ::= <variable> <bln> : = <bln> <expression>
 *
 * @param {string} program - Program source. Token is going to be found at the beginning of the program
 * @returns {*}
 *      ============================|===============\ token found /===============|=======\ token not found /===========
 *      {string} program            | The rest of the program without found token | null
 *      {string} exception          | null                                        | Exception message
 *      {number} excPosFromEnd      | null                                        | Number of chars between the end of
 *                                                                                |   the program and the exception
 *      {AssignmentNode} node ======|_____________________________________________|_________________
 *           {string} varLeft       | <variable>                                  | null
 *           {string} var1 / const1 | <const_or_var>                              | null
 *           {string} sign          | <expression_sign> / null                    | null
 *           {string} var2 / const2 | <const_or_var> / null                       | null
 *
 */
function parseAsAssignment(program) {

    let res, varLeft;

    let regexExpression1 = /^\s*([\s\S]*)$/;
    res = program.match(regexExpression1);
    program = res[1];


    res = parseAsVariable(program);
    if (res.exception) return res;
    varLeft = res.variable;
    program = res.program;


    let regexExpression2 = /^\s*:\s*=([\s\S]*)$/;
    res = program.match(regexExpression2);
    if (!res) return {
        exception: 'Expected \':=\'',
        excPosFromEnd: variable.program.length
    };
    program = res[1];


    res = parseAsExpression(program);
    if (res.exception) return res;
    program = res.program;

    let assignmentNode = new AssignmentNode({
        varLeft: varLeft,
        const1: res.const1,
        var1: res.var1,
        sign: res.sign,
        const2: res.const2,
        var2: res.var2,
    });

    return {
        node: assignmentNode,
        program: program
    };
}


/**
 * <comparison> ::= <const_or_var> <bln> <relation> <bln> <const_or_var>
 *
 * @param {string} program - Program source. Token is going to be found at the beginning of the program
 * @returns {*}
 *      ============================|===============\ token found /===============|=======\ token not found /===========
 *      {string} var1 / const1      | <const_or_var>                              | null
 *      {string} sign               | <comparison_sign>                           | null
 *      {string} var2 / const2      | <const_or_var>                              | null
 *      {string} program            | The rest of the program without found token | null
 *      {string} exception          | null                                        | Exception message
 *      {number} excPosFromEnd      | null                                        | Number of chars between the end of
 *                                  |                                             |   the program and the exception
 */
function parseAsComparison(program) {

    let res, var1, const1, sign, var2, const2;

    // remove spaces before expression
    let regexExpression1 = /^\s*([\s\S]*)$/;
    res = program.match(regexExpression1);
    program = res[1];


    res = parseAsVariableOrConstant(program);
    if (res.exception) return res;
    var1 = res.variable;
    const1 = res.constant;
    program = res.program;


    let regexExpression2 = /^\s*(=|>|<|~\s*=|>\s*=|<\s*=)?([\s\S]*)$/;
    res = program.match(regexExpression2);
    if (!res) return {
        exception: 'Expected a comparison sign',
        excPosFromEnd: program.length
    };
    sign = res[1].replace(/\s+/g, '');
    program = res[2];


    res = parseAsVariableOrConstant(program);
    if (res.exception) return res;
    var2 = res.variable;
    const2 = res.constant;
    program = res.program;


    return({
        var1: var1,
        var2: var2,
        sign: sign,
        const1: const1,
        const2: const2,
        program: program
    });
}

/**
 * ( <bln> IF <n/s> <spc> <comparison> <spc> <n/s> THEN <n/s> <program> <n/s> ELSE <n/s> <program> <n/s> )
 *
 * @param program
 * @returns {*}
 */
function parseAsCondition(program) {
    let res,
        compConst1, compVar1, compSign, compConst2, compVar2,
        trueBranch, falseBranch;

    let regexExpression1 = /^\s*\(\s*IF\s{2,}([\s\S]*)$/;
    res = program.match(regexExpression1);
    if (!res) return {
        exception: 'Expected \'(IF  \'',
        excPosFromEnd: program.length
    };
    program = res[1];

    res = parseAsComparison(program);
    if (res.exception) return res;
    compConst1 = res.const1;
    compVar1 = res.var1;
    compSign = res.sign;
    compConst2 = res.const2;
    compVar2 = res.var2;
    program = res.program;


    let regexExpression2 = /^\s{2,}THEN([\s\S]*)$/;
    res = program.match(regexExpression2);
    if (!res) return {
        exception: 'Expected \'  THEN\'',
        excPosFromEnd: program.length
    };
    program = res[1];


    res = parseNextNodeOrSkip(program);
    if (res.exception) return res;
    trueBranch = res.node;
    program = res.program;


    let regexExpression3 = /^\s+ELSE([\s\S]*)$/;
    res = program.match(regexExpression3);
    if (!res) return {
        exception: 'Expected \' ELSE\'',
        excPosFromEnd: program.length
    };
    program = res[1];


    res = parseNextNodeOrSkip(program);
    if (res.exception) return res;
    falseBranch = res.node;
    program = res.program;


    let regexExpression4 = /^\s+\)([\s\S]*)$/;
    res = program.match(regexExpression4);
    if (!res) return {
        exception: 'Expected \' )\'"',
        excPosFromEnd: program.length
    };
    program = res[1];


    let conditionNode = new ConditionNode({
        compConst1: compConst1,
        compVar1: compVar1,
        compSign: compSign,
        compConst2: compConst2,
        compVar2: compVar2,
        trueBranch: trueBranch,
        falseBranch: falseBranch
    });

    return {
        node: conditionNode,
        program: program
    };
}


function parseNextNodeOrSkip(program) {

    return parseBestOption(
        [
            () => parseAsSkip(program),
            () => parseNextNode(program)
        ],
        'Expected Condition/Assignment/Cycle/\'SKIP\''
    );
}


/**
 * ( <bln> WHINV <n/s> <spc> <comparison> <spc> <n/s> EOI <n/s> <spc> <comparison> <spc> <n/s> DO <n/s> <program> <n/s> )
 *
 * @param program
 * @returns {*}
 */
function parseAsCycle(program) {
    let res,
        invConst1, invVar1, invSign, invConst2, invVar2,
        compConst1, compVar1, compSign, compConst2, compVar2,
        body;


    let regexExpression1 = /^\s*\(\s*WHINV\s{2,}([\s\S]*)$/;
    res = program.match(regexExpression1);
    if (!res) return {
        exception: 'Expected \'(WHINV  \'',
        excPosFromEnd: program.length
    };
    program = res[1];


    res = parseAsComparison(program);
    if (res.exception) return res;
    invConst1 = res.const1;
    invVar1 = res.var1;
    invSign = res.sign;
    invConst2 = res.const2;
    invVar2 = res.var2;
    program = res.program;


    let regexExpression2 = /^\s{2,}EOI\s{2,}([\s\S]*)$/;
    res = program.match(regexExpression2);
    if (!res) return {
        exception: 'Expected \'  EOI  \'',
        excPosFromEnd: program.length
    };
    program = res[1];


    res = parseAsComparison(program);
    if (res.exception) return res;
    compConst1 = res.const1;
    compVar1 = res.var1;
    compSign = res.sign;
    compConst2 = res.const2;
    compVar2 = res.var2;
    program = res.program;




    let regexExpression3 = /^\s{2,}DO\s+([\s\S]*)$/;
    res = program.match(regexExpression3);
    if (!res) return {
        exception: 'Expected \'  DO \'',
        excPosFromEnd: program.length
    };
    program = res[1];


    res = parseNextNodeOrSkip(program);
    if (res.exception) return res;
    body = res.node;
    program = res.program;



    let regexExpression4 = /^\s+\)([\s\S]*)$/;
    res = program.match(regexExpression4);
    if (!res) return {
        exception: 'Expected \' )\'',
        excPosFromEnd: program.length
    };
    program = res[1];


    let cycleNode = new CycleNode({
        invConst1: invConst1,
        invVar1: invVar1,
        invSign: invSign,
        invConst2: invConst2,
        invVar2: invVar2,
        compConst1: compConst1,
        compVar1: compVar1,
        compSign: compSign,
        compConst2: compConst2,
        compVar2: compVar2,
        body: body,
    });

    return {
        node: cycleNode,
        program: program
    };
}


function parseAsSkip(program) {

    let regexExpression1 = /^\s*SKIP([\s\S]*)$/;
    let res = program.match(regexExpression1);
    if (!res) return {
        exception: 'Expected \'SKIP\'',
        excPosFromEnd: program.length
    };
    program = res[1];

    return {
        program: program,
        node: null
    };
}


function parseBestOption(options, messageOnEqual) {

    if (options.length < 2) throw '[options] have to contain more than one function';
    let excepted = [];
    let parsed = null;

    do {
        parsed = options.pop()();
        excepted.push(parsed);
    } while (parsed.exception && (options.length > 0));

    if (parsed.exception) {

        excepted = excepted.sort((a,b) => a.excPosFromEnd - b.excPosFromEnd);

        if (excepted[0].excPosFromEnd === excepted[excepted.length-1].excPosFromEnd) {
            return {
                exception: messageOnEqual,
                excPosFromEnd: excepted[0].excPosFromEnd
            }
        } else {
            return excepted[0];
        }
    } else {
        return parsed
    }
}


/**
 * An argument is a remainder of the program,
 * returns nextNode and remainder of the program without an operator in the nextNode
 */
function parseNextNode(program) {

    let parsed = parseBestOption(
        [
            () => parseAsCondition(program),
            () => parseAsAssignment(program),
            () => parseAsCycle(program)
        ],
        'Expected Condition/Assignment/Cycle'
    );
    if (parsed.exception) return parsed;

    let node = parsed.node;
    program = parsed.program;

    let regexExpression1 = /^\s+;\s([\s\S]*)$/;
    let res = program.match(regexExpression1);

    if (res) {
        program = res[1];
        let parsedNode = parseNextNode(program);
        if (parsedNode.exception) return parsedNode;
        node.setNext(parsedNode.node);
        program = parsedNode.program;
    }

    return {
        node: node,
        program: program
    }
}

/**
 * parse all program
 * returns a tree of Nodes
 */
function parse(program) {
    let node = parseNextNode(program);

    let root = null,
        exception = null,
        exceptionPos = null;

    if (node.node) {
        root = node.node;
        if (node.program.replace(/\s*/, '') !== '' ) {
            exception = 'Unexpected symbol after the end of the program';
            exceptionPos = program.length - node.program.length;
        }
    } else {
        exception = node.exception;
    }

    return new Tree(root, exception, exceptionPos);
}

let r = parse(
"\
             (IF  x < y  THEN   \
        (WHINV  _x < u  EOI  x = y  DO \
           (IF  x = y  THEN \
              z := 0 ; k := m + n  \
           ELSE  \
              diman := pidr ; \
              maxim := shwarz ; \
              (IF  max = d  THEN d:= max ELSE cl  := var ) ;\
              diman := savel \
           ) ; \
           savel := krasavcheg       \
        )\
    ELSE \
        y := z \
    )  "
);

let ewq = 456;