import {parseBestOption} from './bestOption'

function parseAsConstant(formula) {
    let regexConst = /^\s*(-?[0-9]+)((?:[^a-z][\s\S]*)|)$/;
    let res = formula.match(regexConst);
    return res ? {
        parsed: res[1],
        formula: res[2] ? res[2] : ''
    } : {
        exception: 'Expected a constant',
        excPosFromEnd: formula.length
    }
}

function parseAsVariable(formula) {
    let regexVariable = /^\s*([a-z][a-z0-9]*)([\s\S]*)$/;
    let res = formula.match(regexVariable);
    return res ? {
        parsed: res[1],
        formula: res[2]
    } : {
        exception: 'Expected a variable',
        excPosFromEnd: formula.length
    }
}

function parseAsVariableOrConstant(formula) {
    return parseBestOption(
        [
            () => parseAsVariable(formula),
            () => parseAsConstant(formula),
        ],
        'Expected a variable or constant'
    );
}

function parseAsComplexExpressionWithParentheses(formula) {
    let res,
        parsed;

    let regexExpression1 = /^\s*\(([\s\S]*)$/;
    res = formula.match(regexExpression1);
    if (!res) return {
        exception: 'Expected \'(\'',
        excPosFromEnd: formula.length
    };
    formula = res[1];

    res = parseAsComplexExpression(formula);
    if (res.exception) return res;
    formula = res.formula;
    parsed = res.parsed;

    let regexExpression2 = /^\s*\)([\s\S]*)$/;
    res = formula.match(regexExpression2);
    if (!res) return {
        exception: 'Expected \')\'',
        excPosFromEnd: formula.length
    };
    formula = res[1];

    return {
        formula: formula,
        parsed: '(' + parsed + ')'
    }
}

function parseAsComplexExpression(formula) {
    let res,
        parsed = '';

    res = parseBestOption(
        [
            () => parseAsComplexExpressionWithParentheses(formula),
            () => parseAsVariableOrConstant(formula),
        ],
        'Expected parentheses or expression'
    );

    if (res.exception) return res;
    formula = res.formula;
    parsed += res.parsed;

    let regexExpression1 = /^\s*([*+-])([\s\S]*)$/;

    while ((res = formula.match(regexExpression1))) {
        formula = res[2];
        parsed += ' ' + res[1] + ' ';

        res = parseAsComplexExpression(formula);
        if (res.exception) return res;
        formula = res.formula;
        parsed += res.parsed;
    }

    return {
        formula: formula,
        parsed: parsed
    }
}

function parseAsComplexComparison(formula) {
    let res,
        parsed = '';

    let regexExpression1 = /^\s*([\s\S]*)$/;
    res = formula.match(regexExpression1);
    formula = res[1];

    res = parseAsComplexExpression(formula);
    if (res.exception) return res;
    formula = res.formula;
    parsed += res.parsed;

    let regexExpression2 = /^\s*(~\s*=|>\s*=|<\s*=|=|>|<)([\s\S]*)$/;
    res = formula.match(regexExpression2);
    if (!res) return {
        exception: 'Expected a comparison sign',
        excPosFromEnd: formula.length
    };
    formula = res[2];
    parsed += ' ' + res[1] + ' ';

    res = parseAsComplexExpression(formula);
    if (res.exception) return res;
    formula = res.formula;
    parsed += res.parsed;

    return {
        formula: formula,
        parsed: parsed
    }
}

function parseAsFormulaWithParentheses(formula) {
    let res,
        parsed;

    let regexExpression1 = /^\s*\(([\s\S]*)$/;
    res = formula.match(regexExpression1);
    if (!res) return {
        exception: 'Expected \'(\'',
        excPosFromEnd: formula.length
    };
    formula = res[1];

    res = parseAsFormula(formula);
    if (res.exception) return res;
    formula = res.formula;
    parsed = res.parsed;

    let regexExpression2 = /^\s*\)([\s\S]*)$/;
    res = formula.match(regexExpression2);
    if (!res) return {
        exception: 'Expected \')\'',
        excPosFromEnd: formula.length
    };
    formula = res[1];

    return {
        formula: formula,
        parsed: '(' + parsed + ')'
    }
}

export function parseAsFormula(formula) {
    let res,
        parsed = '';

    res = parseBestOption(
        [
            () => parseAsFormulaWithParentheses(formula),
            () => parseAsComplexComparison(formula),
        ],
        'Expected parentheses or comparison'
    );

    if (res.exception) return res;
    formula = res.formula;
    parsed += res.parsed;

    let regexExpression1 = /^\s*(&&|&|\|\||\|)([\s\S]*)$/;

    while ((res = formula.match(regexExpression1))) {
        formula = res[2];
        parsed += ' ' + res[1] + ' ';

        res = parseAsFormula(formula);
        if (res.exception) return res;
        formula = res.formula;
        parsed += res.parsed;
    }

    return {
        formula: formula,
        parsed: parsed
    }
}

export function parseFormula(formula) {

    let formulaLength = formula.length;
    let parsed = parseAsFormula(formula);

    let exception = parsed.exception,
        excPosFromEnd = parsed.excPosFromEnd;

    if (!exception) {
        formula = parsed.formula;

        let regexExpression = /^\s*([\s\S]*)$/;
        let res = formula.match(regexExpression);

        if (res[1].length !== 0) {
            exception = 'Unexpected symbol after the end of the formula';
            excPosFromEnd = res[1].length;
            formula = null;
        }
    }

    return {
        formula: parsed.parsed,    //formula here - parsed string, not the remaining string as everywhere above
        exception: exception,
        exceptionPosition: formulaLength - excPosFromEnd,
    };
}
