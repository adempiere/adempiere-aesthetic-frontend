import store from '@/ADempiere/shared/store'
import { convertBooleanToString } from './valueFormat'
import { IReferenceData } from '@/ADempiere/modules/field'
import evaluator from '@/ADempiere/shared/utils/evaluator'
import { Namespaces } from './types'
// import store from '@/store'
export default evaluator

// get context state from vuex store
export const getContext = (data: {
    parentUuid?: string
    containerUuid?: string
    columnName: string
}): any => {
  const { parentUuid, containerUuid, columnName } = data
  let value: any
  const isPreferenceValue: boolean =
        columnName.startsWith('$') ||
        columnName.startsWith('#') ||
        columnName.startsWith('P|')
  if (isPreferenceValue) {
    value = store.getters[Namespaces.Preference + '/' + 'getPreference']({
      parentUuid,
      containerUuid,
      columnName
    })
  }
  if (!isPreferenceValue && value) {
    value = store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
      parentUuid,
      containerUuid,
      columnName
    })
  }
  return value
}

/**
 *  Get Preference.
 *  <pre>
 *      0)  Current Setting
 *      1)  Window Preference
 *      2)  Global Preference
 *      3)  Login settings
 *      4)  Accounting settings
 *  </pre>
 *  @param  {string} parentUuid UUID Window
 *  @param  {string} containerUuid  UUID Tab, Process, SmartBrowser, Report and Form
 *  @param  {string}  columnName (context)  Entity to search
 *  @return preference value
 */
export function getPreference(data: {
    parentUuid: string
    containerUuid: string
    columnName: string
}) {
  const { parentUuid, containerUuid, columnName } = data
  let value
  if (!columnName) {
    console.warn('Require Context ColumnName')
    return value
  }

  //        USER PREFERENCES
  // View Preferences
  if (parentUuid) {
    value = getContext({
      parentUuid: 'P' + parentUuid,
      containerUuid,
      columnName
    })
    if (value) {
      return value
    }
  }

  //  Global Preferences
  value = getContext({
    columnName: 'P|' + columnName
  })
  if (value) {
    return value
  }

  //        SYSTEM PREFERENCES
  // Login setting
  // get # globals context only window
  value = getContext({
    columnName: '#' + columnName
  })
  if (value) {
    return value
  }

  //  Accounting setting
  value = getContext({
    columnName: '$' + columnName
  })

  return value
} // get preference value

/**
 * Extracts the associated fields from the logics or default values
 * @param {string} displayLogic
 * @param {string} mandatoryLogic
 * @param {string} readOnlyLogic
 * @param {object} reference
 * @param {string} defaultValue
 * @returns {array} List column name of parent fields
 */
export function getParentFields(data: {
    displayLogic: string
    mandatoryLogic: string
    readOnlyLogic: string
    reference: IReferenceData
    defaultValue: string
}) {
  const {
    displayLogic,
    mandatoryLogic,
    readOnlyLogic,
    reference,
    defaultValue
  } = data
  const parentFields: string[] = Array.from(
    new Set([
      //  For Display logic
      ...evaluator.parseDepends(displayLogic),
      //  For Mandatory Logic
      ...evaluator.parseDepends(mandatoryLogic),
      //  For Read Only Logic
      ...evaluator.parseDepends(readOnlyLogic),
      //  For Default Value
      ...evaluator.parseDepends(defaultValue)
    ])
  )
  //  Validate reference
  if (reference && reference.validationCode) {
    parentFields.push(...evaluator.parseDepends(reference.validationCode))
  }
  return parentFields
}

export const specialColumns: string[] = [
  'C_AcctSchema_ID',
  'C_Currency_ID',
  'C_Convertion_Type_ID'
]

/**
 * Parse Context String
 * @param {string} value: (REQUIRED) String to parsing
 * @param {string} parentUuid: (REQUIRED from Window) UUID Window
 * @param {string} containerUuid: (REQUIRED) UUID Tab, Process, SmartBrowser, Report and Form
 * @param {string} columnName: (Optional if exists in value) Column name to search in context
 * @param {boolean} isBooleanToString, convert boolean values to string ('Y' or 'N')
 * @param {boolean} isSQL
 * @param {boolean} isSOTrxMenu
 */
export function parseContext(data: {
    parentUuid?: string
    containerUuid: string
    columnName?: string
    value?: string
    isSQL?: boolean
    isBooleanToString?: boolean
    isSOTrxMenu?: boolean
}) {
  let {
    isSQL,
    isBooleanToString,
    value,
    columnName,
    parentUuid,
    containerUuid,
    isSOTrxMenu
  } = data
  // Default values
  let contextInfo: any
  isSQL = isSQL === undefined ? false : isSQL
  isBooleanToString =
        isBooleanToString === undefined ? false : isBooleanToString

  let isError = false
  const errorsList: string[] = []
  // let contextInfo: any

  if (!value) {
    value = undefined
    if (specialColumns.includes(columnName!)) {
      value = contextInfo = getContext({
        columnName: '$' + columnName
      })
    }

    return {
      value,
      isError: true,
      errorsList
    }
  }
  value = String(value).replace('@SQL=', '')
  // const instances = value.length - value.replace('@', '').length
  // if ((instances > 0) && (instances % 2) !== 0) { // could be an email address
  //   return value
  // }

  let token: string
  let inString: string = value
  let outString = ''

  let firstIndexTag: number = inString.indexOf('@')

  while (firstIndexTag !== -1) {
    outString = outString + inString.substring(0, firstIndexTag) // up to @
    inString = inString.substring(firstIndexTag + 1, inString.length) // from first @
    const secondIndexTag: number = inString.indexOf('@') // next @
    // no exists second tag
    if (secondIndexTag < 0) {
      console.info(`No second tag: ${inString}`)
      return {
        value: undefined,
        isError: true,
        errorsList,
        isSQL
      }
    }

    token = inString.substring(0, secondIndexTag)
    columnName = token

    contextInfo = getContext({
      parentUuid,
      containerUuid,
      columnName
    }) // get context

    if (!contextInfo) {
      // get global context
      if (token.startsWith('#') || token.startsWith('$')) {
        contextInfo = getContext({
          columnName
        })
      } else {
        // get accounting context
        if (specialColumns.includes(columnName)) {
          contextInfo = getContext({
            columnName: '$' + columnName
          })
        }
      }
    }

    // menu attribute isEmptyValue isSOTrx
    if (isSOTrxMenu !== undefined && token === 'IsSOTrx' && !contextInfo) {
      contextInfo = isSOTrxMenu
    }

    if ((isBooleanToString || isSQL) && typeof contextInfo === 'boolean') {
      contextInfo = convertBooleanToString(contextInfo)
    }

    if (!contextInfo) {
      // console.info(`No Context for: ${token}`)
      isError = true
      errorsList.push(token)
    } else {
      if (['object', 'boolean'].includes(typeof contextInfo)) {
        outString = contextInfo
      } else {
        outString = outString + contextInfo // replace context with Context
      }
    }

    inString = inString.substring(secondIndexTag + 1, inString.length) // from second @
    firstIndexTag = inString.indexOf('@')
  } // end while loop

  if (!['object', 'boolean'].includes(typeof contextInfo)) {
    outString = outString + inString // add the rest of the string
  }
  if (isSQL) {
    return {
      errorsList,
      isError,
      isSQL,
      query: outString,
      value: contextInfo
    }
  }
  return {
    errorsList,
    isError,
    isSQL,
    value: outString
  }
} // parseContext
