import { TABLE_DIRECT, TABLE } from './references'
import { convertStringToBoolean, convertBooleanToString } from './valueFormat'

export function extractPagingToken(token: string): string {
  let onlyToken: string = token.slice(0, -2)
  if (onlyToken.substr(-1, 1) === '-') {
    onlyToken = onlyToken.slice(0, -1)
  }
  return onlyToken
}

/**
 * Get date and time from client in a object value
 * @param {string} type Type value of return
 * @returns {object|string}
 */
export function clientDateTime(date: string | null = null, type = '') {
  let dateTime: Date
  if (date == null || date === undefined || (typeof date === 'string' && date.trim() === '')) {
    // instance the objet Data with current date from client
    dateTime = new Date()
  } else {
    // instance the objet Data with date or time send
    dateTime = new Date(date)
  }

  const currentDate = dateTime.getFullYear() +
    '-' + zeroPad(dateTime.getMonth() + 1) +
    '-' + zeroPad(dateTime.getDate())

  const currentTime = dateTime.getHours() +
    ':' + dateTime.getMinutes() +
    ':' + dateTime.getSeconds()

  const currentDateTime = {
    date: currentDate,
    time: currentTime
  }

  if (type.toLowerCase() === 't') {
    // time format HH:II:SS
    return currentDateTime.time
  } else if (type.toLowerCase() === 'd') {
    // date format YYYY-MM-DD
    return currentDateTime.date
  } else if (type.toLocaleLowerCase() === 'o') {
    // object format
    return currentDateTime
  }
  return currentDateTime.date + ' ' + currentDateTime.time
}

/**
 * zero pad
 * @param {number|string} number
 * @param {number} pad
 * @returns {string}
 */
export function zeroPad(number: number, pad = 2): string {
  const zero = Number(pad) - number.toString().length + 1
  return Array(+(zero > 0 && zero)).join('0') + number
}

export function typeValue(value: any): string {
  const typeOfValue = Object!.prototype.toString
    .call(value)
    .match(/^\[object\s(.*)\]$/)![1]
    .toUpperCase()

  return typeOfValue
}

/**
 * Parsed value to component type
 * @param {mixed} value, value to parsed
 * @param {string} componentPath
 * @param {number} displayType, reference in ADempiere
 * @param {boolean} isMandatory, field is mandatory
 * @param {boolean} isIdentifier, field is ID
 */
export function parsedValueComponent(data: {
    componentPath: string
    value?: any
    columnName: string
    displayType: number
    isMandatory?: boolean
}) {
  data.isMandatory = data.isMandatory !== undefined
  let { componentPath, value, columnName, displayType, isMandatory } = data
  const isEmpty = !value

  if (isEmpty && !isMandatory) {
    if (componentPath === 'FieldYesNo') {
      if (columnName === 'IsActive') {
        return true
      }
      // Processing, Processed, and any other columnName, return false by default
      return Boolean(value)
    }
    return undefined
  }
  let returnValue: any

  switch (componentPath) {
    // data type Number
    case 'FieldNumber':
      if (isEmpty) {
        returnValue = undefined
        if (isMandatory) {
          returnValue = 0
        }
      } else if (
        typeof value === 'object' &&
                Object.prototype.hasOwnProperty.call(value, 'query')
      ) {
        returnValue = value
      } else {
        if (Array.isArray(value) && value.length) {
          returnValue = value
        } else {
          returnValue = Number(value)
        }
      }
      break

      // data type Boolean
    case 'FieldYesNo':
      if (
        typeof value === 'object' &&
                Object.prototype.hasOwnProperty.call(value, 'query')
      ) {
        returnValue = value
      }
      returnValue = convertStringToBoolean(value)
      returnValue = Boolean(returnValue)
      break

      // data type String
    case 'FieldText':
    case 'FieldTextArea':
      if (
        typeof value === 'object' &&
                Object.prototype.hasOwnProperty.call(value, 'query')
      ) {
        returnValue = value
      }
      returnValue = value ? String(value) : undefined
      break

      // data type Date
    case 'FieldDate':
    case 'FieldTime ':
      if (isEmpty) {
        value = undefined
      }
      if (!isNaN(value)) {
        value = Number(value)
      }
      if (typeof value === 'number' || typeof value === 'string') {
        value = new Date(value)
      }
      if (
        typeof value === 'object' &&
                Object.prototype.hasOwnProperty.call(value, 'query')
      ) {
        returnValue = value
      }
      returnValue = value
      break

    case 'FieldSelect':
      if (isEmpty) {
        value = undefined
      }
      if (typeof value === 'boolean') {
        value = convertBooleanToString(value)
      }
      // Table (18) or Table Direct (19)
      if (
        TABLE_DIRECT.id === displayType ||
                (TABLE.id === displayType && columnName.includes('_ID'))
      ) {
        if (value) {
          value = Number(value)
        }
      }
      // Search or List
      returnValue = value
      break

    default:
      returnValue = value
      break
  }
  return returnValue
}

/**
 * Find element in an array recursively
 * @param {object|array} treeData
 * @param {string} attributeName, key to get value, default id
 * @param {string} secondAttribute, key to get value, default id
 * @param {mixed}  attributeValue, value to compare with search
 * @param {string} attributeChilds, childs list into element
 */

export interface IRecursiveTreeSearchParams {
    treeData: any[]
    attributeValue: string
    attributeName?: string
    secondAttribute?: string | false
    attributeChilds?: string
    isParent?: boolean
}
export const recursiveTreeSearch = (data: IRecursiveTreeSearchParams) => {
  const { treeData, attributeChilds = data.attributeChilds || 'childsList', attributeName = data.attributeName || 'id', attributeValue, secondAttribute = data.secondAttribute || false, isParent = data.isParent || false } = data
  if (Array.isArray(treeData)) {
    let index = 0
    const length: number = treeData.length
    while (index < length) {
      let value = treeData[index]
      if (value && Object.prototype.hasOwnProperty.call(value, attributeName)) {
        value = value[attributeName]
      }
      if (value && secondAttribute && Object.prototype.hasOwnProperty.call(value, secondAttribute)) {
        value = value[(secondAttribute)]
      }

      // compare item to search
      if (value === attributeValue) {
        return treeData[index]
      }

      if (treeData[index] && treeData[index][attributeChilds]) {
        const found: Function = recursiveTreeSearch({
          treeData: treeData[index][attributeChilds],
          attributeValue,
          attributeName,
          secondAttribute,
          attributeChilds,
          isParent
        })
        if (found) {
          return found
        }
      }
      index++
    }
  } else {
    let value = treeData
    if (value && Object.prototype.hasOwnProperty.call(value, attributeName)) {
      value = value[attributeName]
    }
    if (value && secondAttribute && Object.prototype.hasOwnProperty.call(value, secondAttribute)) {
      value = value[secondAttribute]
    }

    // compare item to search
    if (value === attributeValue) {
      return treeData
    }

    const found: Function = recursiveTreeSearch({
      treeData: treeData[attributeChilds],
      attributeValue,
      attributeName,
      secondAttribute,
      attributeChilds
    })
    return found
  }
}
// Note: Check types
export function convertFieldsListToShareLink(fieldsList: any[]) {
  let attributesListLink = ''
  fieldsList.map((fieldItem: any) => {
    // assign values
    let value = fieldItem.value
    let valueTo = fieldItem.valueTo

    if (value) {
      if (['FieldDate', 'FieldTime'].includes(fieldItem.componentPath) || typeof value === 'object') {
        value = value.getTime()
      }
      attributesListLink += `${fieldItem.columnName}=${encodeURIComponent(value)}&`
    }

    if (fieldItem.isRange && valueTo) {
      if (['FieldDate', 'FieldTime'].includes(fieldItem.componentPath) || typeof value === 'object') {
        valueTo = valueTo.getTime()
      }
      attributesListLink += `${fieldItem.columnName}_To=${encodeURIComponent(valueTo)}&`
    }
  })

  return attributesListLink.slice(0, -1)
}

let partialValue = ''
export function calculationValue(value: any, event: any): string | null | undefined {
  const isZero = Number(value) === 0
  // eslint-disable-next-line
  const VALIDATE_EXPRESSION: RegExp = new RegExp(/[\d\/.()%\*\+\-]/gim)
  const isValidKey = VALIDATE_EXPRESSION.test(event.key)
  if (event.type === 'keydown' && isValidKey) {
    partialValue += event.key
    const operation: string = !value || isZero ? partialValue : String(value) + partialValue
    if (operation) {
      try {
        // eslint-disable-next-line no-eval
        return eval(operation) + ''
      } catch (error) {
        return null
      }
    }
  } else if (event.type === 'click') {
    if (value) {
      try {
        // eslint-disable-next-line no-eval
        return eval(value) + ''
      } catch (error) {
        return null
      }
    }
  } else {
    if ((event.key === 'Backspace' || event.key === 'Delete') && value) {
      try {
        // eslint-disable-next-line no-eval
        return eval(value) + ''
      } catch (error) {
        return null
      }
    } else {
      return null
    }
  }
}

export function currencyFind(params: {
  currencyCurrent: any
  listCurrency: any[]
  defaultCurrency: any
}) {
  const { currencyCurrent, listCurrency, defaultCurrency } = params
  if (listCurrency && listCurrency.length) {
    const currency = listCurrency.find(item => {
      if (item.currencyUuid === currencyCurrent) {
        return item
      }
    })
    if (currency) {
      return currency
    }
  }
  return defaultCurrency.iSOCode
}
/**
 * Search the Payment List for the Current Payment
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 * @param {string} currentPayment Current Payment
 * @param {array} listTypePayment Payment Type Listings
 */

export function tenderTypeFind(params: {
  currentPayment: any
  listTypePayment: any[]
}) {
  const { currentPayment, listTypePayment } = params
  const payment = listTypePayment.find(item => {
    if (item.tenderTypeCode === currentPayment) {
      return item.tenderTypeDisplay
    }
  })
  if (payment) {
    return payment.tenderTypeDisplay
  }
  return currentPayment
}

export function clearVariables() {
  partialValue = ''
}

/**
 * add a tab depending on the status of the document
 * @param {string} tag, document status key
 */
export function tagStatus(tag: string): string {
  let type = ''
  switch (tag) {
    case 'VO':
      type = 'danger'
      break
    case 'AP':
      type = 'success'
      break
    case 'DR':
      type = 'info'
      break
    case 'CL':
      type = 'primary'
      break
    case 'CO':
      type = 'success'
      break
    case '??':
      type = 'info'
      break
    case 'IP':
      type = 'warning'
      break
    case 'WC':
      type = 'warning'
      break
    case 'WP':
      type = 'warning'
      break
    case 'NA':
      type = 'danger'
      break
    case 'IN':
      type = 'danger'
      break
    case 'RE':
      type = 'danger'
      break
  }
  return type
}
