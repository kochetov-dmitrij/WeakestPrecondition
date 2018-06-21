/**
 * Picks first appropriate parseProgram function if any, otherwise return exception of a function that parsed furthest
 *
 * @param {[function]} options - array of parseProgram functions
 * @param messageOnEqual - exception message if all functions parsed the same number of chars before an exception
 * @returns {*}
 *      =======================|=====\ token found /=====|===================\ token not found /========================
 *      {string} node          | null                    | null
 *      {string} program       | The rest of the program | null
 *                             |     without found token |
 *                             |                         |===\ excPosFromEnd equal /==|==\ excPosFromEnd not equal /====
 *      {number} excPosFromEnd | null                    | excPosFromEnd from options | min excPosFromEnd from options
 *      {string} exception     | null                    | messageOnEqual             | exception with min excPosFromEnd
 */
export function parseBestOption(options, messageOnEqual) {

    if (options.length < 2) throw new Error('[options] have to contain more than one function');
    let excepted = [];
    let parsed = null;

    do {
        parsed = options.shift()();
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