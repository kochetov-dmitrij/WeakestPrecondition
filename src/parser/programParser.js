import {Tree, AssignmentNode, ConditionNode, CycleNode} from "./tree";
import {parseBestOption} from './bestOption'
import {parseAsFormula} from "./formulaParser";


/*
    BNF tokens:

    <expression_sign> ::= * |
                          + |
                          -

     <comparison_sign> ::= = |
                          >  |
                          <  |
                          ~= |
                          >= |
                          <=
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
 *                             |                                             |      the program and the exception
 */
function parseAsConstant(program) {
    let regexConst = /^\s*(-?[0-9]+)((?:[^a-z][\s\S]*)|)$/;
    let res = program.match(regexConst);
    return res ? {
        constant: res[1],
        program: res[2] ? res[2] : ''
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
 *                             |                                             |      the program and the exception
 */
function parseAsVariable(program) {
    let regexVariable = /^\s*([a-z][a-z0-9]*)([\s\S]*)$/;
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
 *                             |                       |                      |      the program and the exception
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
 *                                  |                                             |      the program and the exception
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


    let regexExpression2 = /^\s*(~\s*=|>\s*=|<\s*=|=|>|<)([\s\S]*)$/;
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
 *                             |                       |                       |      the program and the exception
 */
function parseAsExpression(program) {

    let res, var1, const1, sign, var2, const2;

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
 * <AssignmentNode> ::=
 *   <variable> <bln> : = <bln> <expression>
 *
 * @param {string} program - Program source. Token is going to be found at the beginning of the program
 * @returns {*}
 *      ============================|===============\ token found /===============|=======\ token not found /===========
 *      {string} program            | The rest of the program without found token | null
 *      {string} exception          | null                                        | Exception message
 *      {number} excPosFromEnd      | null                                        | Number of chars between the end of
 *                                  |                                             |      the program and the exception
 *      {AssignmentNode} node ======| {*}                                         | null
 *           {string} varLeft       | <variable>                                  |
 *           {string} var1 / const1 | <const_or_var>                              |
 *           {string} sign          | <expression_sign> / null                    |
 *           {string} var2 / const2 | <const_or_var> / null                       |
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
        excPosFromEnd: program.length
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
 * <ConditionNode> ::=
 *   ( <bln> IF <n/s> <spc> <comparison> <spc> <n/s> THEN <n/s> <program> <n/s> ELSE <n/s> <program> <n/s> )
 *
 * @param {string} program - Program source. Token is going to be found at the beginning of the program
 * @returns {*}
 *      ====================================|==========\ token found /===========|=======\ token not found /===========
 *      {string} program                    | The rest of the program without    | null
 *                                          |                     found token    |
 *      {string} exception                  | null                               | Exception message
 *      {number} excPosFromEnd              | null                               | Number of chars between the end of
 *                                          |                                    |      the program and the exception
 *      {AssignmentNode} node ==============| {*}                                | null
 *           {string} compConst1 / compVar1 | <const_or_var>                     |
 *           {string} compSign              | <comparison_sign>                  |
 *           {string} compConst2 / compVar2 | <const_or_var>                     |
 *           {*Node} trueBranch             | Condition/Assignment/Cycle/null    |
 *           {*Node} falseBranch            | Condition/Assignment/Cycle/null    |
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
        falseBranch: falseBranch,
    });

    return {
        node: conditionNode,
        program: program
    };
}


/**
 * <CycleNode> ::=
 *   ( <bln> WHINV <n/s> <spc> <comparison> <spc> <n/s> EOI <n/s> <spc> <comparison> <spc> <n/s> DO <n/s> <program> <n/s> )
 *
 * @param {string} program - Program source. Token is going to be found at the beginning of the program
 * @returns {*}
 *      ====================================|==========\ token found /===========|=======\ token not found /===========
 *      {string} program                    | The rest of the program without    | null
 *                                          |                     found token    |
 *      {string} exception                  | null                               | Exception message
 *      {number} excPosFromEnd              | null                               | Number of chars between the end of
 *                                          |                                    |      the program and the exception
 *      {AssignmentNode} node ==============| {*}                                | null
 *           {string} invConst1 / invVar1   | <const_or_var>                     |
 *           {string} invSign               | <comparison_sign>                  |
 *           {string} invConst2 / invVar2   | <const_or_var>                     |
 *           {string} compConst1 / compVar1 | <const_or_var>                     |
 *           {string} compSign              | <comparison_sign>                  |
 *           {string} compConst2 / compVar2 | <const_or_var>                     |
 *           {*Node} body                   | Condition/Assignment/Cycle/null    |
 */
function parseAsCycle(program) {
    let res,
        invariant,
        compConst1, compVar1, compSign, compConst2, compVar2,
        body;

    let regexExpression1 = /^\s*\(\s*WIN\s{2,}([\s\S]*)$/;
    res = program.match(regexExpression1);
    if (!res) return {
        exception: 'Expected \'(WIN  \'',
        excPosFromEnd: program.length
    };
    program = res[1];


    res = parseAsFormula(program);
    if (res.exception) return res;
    program = res.formula;
    invariant = res.parsed;

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
        invariant: invariant,
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


/**
 * <Skip> ::= SKIP
 *
 * @param {string} program - Program source. Token is going to be found at the beginning of the program
 * @returns {*}
 *      =======================|==============\ token found /================|=========\ token not found /==========
 *      {string} node          | null                                        | null
 *      {string} program       | The rest of the program without found token | null
 *      {string} exception     | null                                        | Exception message
 *      {number} excPosFromEnd | null                                        | Number of chars between the end of
 *                             |                                             |      the program and the exception
 */
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


/**
 * <*Node> | null
 *
 * @param {string} program - Program source. Token is going to be found at the beginning of the program
 * @returns {*}
 *      =======================|==========\ token found /=========================|=======\ token not found /===========
 *      {string} program       | The rest of the program without found token      | null
 *      {string} exception     | null                                             | Exception message
 *      {number} excPosFromEnd | null                                             | Number of chars between the end of
 *                             |                                                  |      the program and the exception
 *                             |========\ *Node found /=====|====\ SKIP found /===|
 *      {*Node} node           | Condition/Assignment/Cycle | null                | null
 */
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
 * <*Node> ::= <ConditionNode> |
 *             <AssignmentNode> |
 *             <CycleNode>
 *
 * After successfully found node if there is ' ; ' calls parseNextNode(remaining program) recursively and
 *                                                                           puts the result to node.next
 *
 * @param {string} program - Program source. Token is going to be found at the beginning of the program
 * @returns {*}
 *      =======================|==========\ token found /====================|=======\ token not found /===========
 *      {string} program       | The rest of the program without found token | null
 *      {*Node} node           | <*Node>                                     | null
 *      {string} exception     | null                                        | Exception message
 *      {number} excPosFromEnd | null                                        | Number of chars between the end of
 *                             |                                             |      the program and the exception
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
 * Recursively calls the function for branches if any and sets its indexes respectively
 *
 * @param {AssignmentNode | ConditionNode | CycleNode} node - A node to traverse
 * @param { {number} } nodeIndexContainer - Index which is wrapped to an object for passing by reference
 * @param parentIndex - Index of the parent node
 */
function dfsTraverse(node, nodeIndexContainer, parentIndex) {
    nodeIndexContainer.nodeIndex++;
    let nodeIndex = nodeIndexContainer.nodeIndex;
    node.setIndex(nodeIndex, parentIndex);
    [
        node.body,
        node.trueBranch,
        node.falseBranch,
        node.next
    ].forEach((branch) => {if (branch) dfsTraverse(branch, nodeIndexContainer, nodeIndex)});
}


/**
 * Traverses a tree and sets indexes and parent indexes of its nodes in DFS order
 *
 * @param {Tree} tree - A tree to be traversed
 * @returns {number} Number of nodes of the tree
 */
function setIndexesAndParents(tree) {
    let nodeIndexContainer = {nodeIndex: 0};
    dfsTraverse(
        tree.root,
        nodeIndexContainer,
        null
    );
    return nodeIndexContainer.nodeIndex;
}


/**
 * Parses a text program into a tree of connected nodes
 *
 * @param {string} program - Program source to be parsed into tree
 * @returns {Tree}
 *      =======================|===========\ successfully parsed /===========|=========\ failed parseProgram /==========
 *      {*Node} root           | First node of the tree                      | null
 *      {number} numberOfNodes | Number of parsed <*Node>                    | null
 *      {string} exception     | null                                        | Exception message
 *      {number} excPosFromEnd | null                                        | Number of chars between the end of
 *                             |                                             |      the program and the exception
 */
export function parseProgram(program) {

    let programLength = program.length;
    let node = parseNextNode(program);

    let root = node.node,
        exception = node.exception,
        excPosFromEnd = node.excPosFromEnd,
        numberOfNodes = null;

    if (!exception) {
        program = node.program;

        let regexExpression = /^\s*([\s\S]*)$/;
        let res = program.match(regexExpression);

        if (res[1].length !== 0) {
            exception = 'Unexpected symbol after the end of the program';
            excPosFromEnd = res[1].length;
            root = null;
            numberOfNodes = null;
        }
    }

    let tree = new Tree({
        root: root,
        exception: exception,
        exceptionPosition: programLength - excPosFromEnd,
    });

    if (!exception) {
        numberOfNodes = setIndexesAndParents(tree);
        tree.setNumberOfNodes(numberOfNodes);
    }

    return tree;
}
