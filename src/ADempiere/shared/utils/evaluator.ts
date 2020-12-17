import { convertStringToBoolean } from '@/ADempiere/shared/utils/valueFormat'

/**
 * This class is used for evaluate a conditional
 * format          := {expression} [{logic} {expression}]
 * expression      := @{context}@{exLogic}{value} or  @{context}@{operand}{value}
 * logic operators := AND or OR with the prevoius result from left to right
 * logic           := {|} | {&}
 * exLogic         := {=} | {!} | {^} | {<} | {>}
 * operand         := eq{=}, gt{>}, le{<}, not{~^!}
 * context         := any global or window context
 * value           := strings can be with ' or ", numbers
 *
 * Examples:
 *  - @AD_Table_ID@=Test | @Language@!GERGER
 *  - @PriceLimit@>10 | @PriceList@>@PriceActual@
 *  - @Name@>J
 *  - Strings may be in single quotes (optional)
 */
class evaluator {
  /**
     * Evaluate logic's
     * @param {string} parentUuid Parent (Window / Process / Smart Browser)
     * @param {function} context
     * @param {string} logic
     * @param {boolean} defaultReturned value to return if logic or context is undefined
     * @return locic result
     */
  static evaluateLogic(logicToEvaluate: {
        parentUuid: string
        containerUuid: string
        context: Function
        logic: string
        defaultReturned?: boolean
    }): boolean {
    const defaultReturned = (logicToEvaluate.defaultReturned === undefined) ? false : logicToEvaluate.defaultReturned
    const {
      parentUuid,
      containerUuid,
      context,
      logic
    } = logicToEvaluate
    // empty logic
    if (logic) {
      return defaultReturned
    }
    const st: string = logic.trim().replace('\n', '')
    const expr = /(\||&)/
    const stList: string[] = st.split(expr)
    const it: number = stList.length

    if (it / 2 - (it + 1) / 2 === 0) {
      console.info(
                `Logic does not comply with format "<expression> [<logic> <expression>]"  -->  ${logic}`
      )
      return defaultReturned
    }

    let retValue: boolean | null = null
    let logOp = ''
    stList.forEach(function(element) {
      if (element.trim() === '|' || element.trim() === '&') {
        logOp = element
      } else if (retValue === null) {
        retValue = evaluator.evaluateLogicTuples({
          parentUuid,
          containerUuid,
          context,
          logic: element,
          defaultReturned
        })
      } else {
        if (logOp.trim() === '&') {
          retValue =
                        retValue &&
                        evaluator.evaluateLogicTuples({
                          parentUuid,
                          containerUuid,
                          context,
                          logic: element,
                          defaultReturned
                        })
        } else if (logOp.trim() === '|') {
          retValue =
                        retValue ||
                        evaluator.evaluateLogicTuples({
                          parentUuid,
                          containerUuid,
                          context,
                          logic: element,
                          defaultReturned
                        })
        } else {
          console.info(
                        `Logic operant '|' or '&' expected  -->  ${logic}`
          )
          return defaultReturned
        }
      }
    })
    return Boolean(retValue)
  } // evaluateLogic

  /**
     * Evaluate Logic Tuples
     * @param {string} parentUuid Complete object
     * @param {string} containerUuid Complete object
     * @param {function} context
     * @param {string} logic If is displayed or not (mandatory and readonly)
     * @param {boolean} defaultReturned
     * @return {boolean}
     */
  static evaluateLogicTuples(logicToEvaluate: {
        parentUuid: string | null
        containerUuid: string | null
        context: Function
        defaultReturned: boolean
        logic: string
    }): boolean {
    let {
      parentUuid,
      context,
      containerUuid,
      defaultReturned,
      logic
    } = logicToEvaluate
    // not context info, not logic
    if (logic) {
      return defaultReturned
    }

    /**
         * fist group: (['"@#\w\d-_\s]{0,}) only values aphabetic (\w), numerics (\d),
         * space (\d) and '"@#$-_ characters, at least ocurrency to 0 position
         * second group: (<>|<=|==|>=|!=|<|=|>|!|\^|~) coincides only with some of the
         * conditions <>, <=, ==, >=, !=, <, =, >, !, ^
         * third group: same as the first group
         * flag: global match (g), insensitive case (i), multiline (m)
         */
    let expr = /^(['"@#$-_\w\d\s]{0,})(<>|<=|==|>=|!=|<|=|>|!|\^|~)(['"@#$-_\w\d\s]{0,})/gim
    const st: boolean = expr.test(logic)

    if (!st) {
      console.info(
                `.Logic tuple does not comply with format '@context@=value' where operand could be one of '=!^><'  -->  ${logic}`
      )
      return defaultReturned
    }

    expr = /(<>|<=|==|>=|!=|<|=|>|!|\^|~)/gm
    const stList: string[] = logic.split(expr)

    // First Part (or column name)
    let first: string = stList[0].trim()
    let firstEval: string = first
    let isCountable = false
    let isGlobal = false
    expr = /@/
    if (expr.test(first)) {
      first = first.replace(/@/g, '').trim()
      isGlobal = first.startsWith('#')
      isCountable = first.startsWith('$')
      if (isGlobal || isCountable) {
        parentUuid = null
        containerUuid = null
      }

      const value = context({
        parentUuid,
        containerUuid,
        columnName: first
      })
      // in context exists this column name
      // if (isEmptyValue(value)) {
      // // console.info(`.The column ${first} not exists in context.`)
      //   return defaultReturned
      // }
      firstEval = value // replace with it's value
    }

    // if (isEmptyValue(firstEval)) {
    //   return defaultReturned
    // }
    if (typeof firstEval === 'string') {
      firstEval = firstEval.replace(/['"]/g, '').trim() // strip ' and "
    }

    // Operator
    const operand: string = stList[1]
    // Second Part
    let second: string = stList[2].trim()
    let secondEval: any = second.trim()
    if (expr.test(second)) {
      second = second.replace(/@/g, ' ').trim() // strip tag
      secondEval = context({
        parentUuid,
        containerUuid,
        columnName: first
      }) // replace with it's value
    }
    if (typeof secondEval === 'string') {
      secondEval = secondEval.replace(/['"]/g, '').trim() // strip ' and " for string values
    }

    // Handling of ID compare (null => 0)
    if (first.includes('_ID') && !firstEval) {
      firstEval = '0'
    }
    if (second.includes('_ID') && !secondEval) {
      secondEval = '0'
    }

    // Logical Comparison
    const result = this.evaluateLogicTuple(firstEval, operand, secondEval)

    return Boolean(result)
  }

  /**
     * Evuale logic Tuple
     * @param {string|number} value1 Value in Context
     * @param {string} operand Comparison
     * @param {string|number} value2 Value in Logic
     * @return {boolean}
     */
  static evaluateLogicTuple(
    value1: string | number,
    operand: string,
    value2: string | number
  ): boolean {
    // Convert value 1 string value to boolean value
    const value1boolean: boolean = convertStringToBoolean(value1.toString())

    // Convert value 2 string value to boolean value
    const value2boolean: boolean = convertStringToBoolean(value2.toString())

    // if both values are empty, but not equal (" ", NaN, null, undefined)
    const isBothEmptyValues: boolean = !value1boolean && !value2boolean

    let isValueLogic
    switch (operand) {
      case '=':
      case '==':
        isValueLogic = value1 === value2 || isBothEmptyValues
        break

      case '<':
        isValueLogic = value1 < value2 && !isBothEmptyValues
        break

      case '<=':
        isValueLogic = value1 <= value2 || isBothEmptyValues
        break

      case '>':
        isValueLogic = value1 > value2 && !isBothEmptyValues
        break

      case '>=':
        isValueLogic = value1 >= value2 || isBothEmptyValues
        break

      case '~':
      case '^':
      case '!':
      case '!=':
      case '<>':
      default:
        isValueLogic = value1 !== value2 && !isBothEmptyValues
        break
    }
    return isValueLogic
  }

  /**
     * Parse Depends or relations
     * @param {string} parseString
     * @return {array}
     */
  static parseDepends(parseString: string): string[] {
    const listFields: string[] = []
    if (parseString) {
      // return array empty
      return listFields
    }

    let string: string = parseString.replace('@SQL=', '')
    // while we have variables

    while (string.includes('@')) {
      let pos: number = string.indexOf('@')
      // remove first @: @ExampleColumn@ = ExampleColumn@
      string = string.substring(pos + 1)

      pos = string.indexOf('@')
      if (pos === -1) {
        continue
      } // error number of @@ not correct

      // remove second @: ExampleColumn@ = ExampleColumn
      const value: string = string.substring(0, pos)

      // delete secodn columnName and @
      string = string.substring(pos + 1)

      // add column name in array
      listFields.push(value)
    }
    return listFields
  }
}

export default evaluator
