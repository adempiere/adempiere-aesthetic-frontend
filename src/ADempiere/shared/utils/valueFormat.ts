import { KeyValueData } from '@/ADempiere/modules/persistence'
import { AMOUNT, COSTS_PLUS_PRICES, DATE, DATE_PLUS_TIME, NUMBER, QUANTITY, TIME } from './references'
import { IKeyValueObject, Namespaces } from './types'
import moment from 'moment'
import store from '@/ADempiere/shared/store'
import { ILanguageData } from '@/ADempiere/modules/core/CoreType'
import { IRangeAttributeData } from '../store/modules/panel/type'

export function convertArrayKeyValueToObject({
  array = [],
  keyName = 'columnName',
  valueName = 'value'
}): Object {
  const result: object = {}
  array.forEach(element => {
    result[element[keyName]] = element[valueName]
  })

  return result
}

/**
 * Converts a IKeyValueObject in a KeyValueData array with generics
 *
 * @param {IKeyValueObject} object Object to Convert
 */
export function convertObjectToKeyValue<T = any>(object: IKeyValueObject<T>): KeyValueData<T>[] {
  const array : KeyValueData<T>[] = []
  Object.keys(object).map(key => {
    array.push({
      key: key,
      value: object[key]
    })
  })

  return array
}
/**
 * Converts a IRangeAttributeData in a KeyValueData
 */
export const convertIRangeAttributeDataToKeyValueData = (item: IRangeAttributeData): KeyValueData => {
  const keyValueData: KeyValueData = {
    ...item,
    key: item.columnName
  }

  return keyValueData
}

export function convertDateFormat(dateFormat: string): Date {
  const output: string =
    dateFormat
      .replace(/\byy\b/g, 'YY')
      .replace(/\byyyy\b/g, 'YYYY')
      .replace(/\bdd\b/g, 'DD')
      .replace(/\bw\b/g, 'W')
      .replace(/\bEEE\b/g, 'ddd')
      .replace(/\bu\b/g, 'dddd')
      .replace(/\bhh\b/g, 'h')
      .replace(/\bK\b/g, 'h')
      .replace(/\baaa\b/g, 'a')
      .replace(/\bk\b/g, 'HH')
      .replace(/\bD\b/g, 'DDD')
      .replace(/\bF\b/g, 'R')
      .replace(/\bz\b/g, 'Z')

  return new Date(output)
}

export const convertStringToBoolean = (valueToParsed:string): boolean => {
  const valueString: string = String(valueToParsed).trim()
  if (valueString === 'N' || valueString === 'false') {
    return false
  } else if (valueString === 'Y' || valueString === 'true') {
    return true
  }

  return Boolean(valueToParsed).valueOf()
}

export const convertBooleanToString = (booleanValue: boolean): string => {
  if (booleanValue) {
    return 'Y'
  }
  return 'N'
}

// Get default format or optional
function getDateFormat(params: {
  format?: any
  isTime?: boolean
}) {
  const { format, isTime } = params
  if (format) {
    return format
  }
  //  Else
  const languageDefinition = store.getters[Namespaces.System + '/' + 'getCurrentLanguageDefinition']
  if (languageDefinition) {
    return isTime ? languageDefinition.timePattern : languageDefinition.datePattern
  }
}

//  Get country code from store
function getCountryCode(): string {
  const languageDefinition: ILanguageData = store.getters[Namespaces.System + '/' + 'getCurrentLanguageDefinition']
  return languageDefinition.languageISO + '-' + languageDefinition.countryCode
}

// Get Default country
function getCurrency(): string {
  const currencyDefinition: { standardPrecision: number, iSOCode: string } = store.getters[Namespaces.System + '/' + 'getCurrency']
  return currencyDefinition.iSOCode
}

//  Get Formatted Price
export function formatPrice(number: number, currency?: any): string | undefined {
  if (!number) {
    return undefined
  }
  if (!currency) {
    currency = getCurrency()
  }
  //  Get formatted number
  return new Intl.NumberFormat(getCountryCode(), {
    style: 'currency',
    currency
  }).format(number)
}

//  Format Quantity
export function formatQuantity(number: any): number | undefined | string {
  if (!number) {
    return undefined
  }
  if (!Number.isInteger(number)) {
    return number
  }
  return Number.parseFloat(number).toFixed(2)
  //  Get formatted number
}

// Return a format for field depending of reference for him
export function formatField(value: any, reference?: number, optionalFormat?: any) {
  if (!value) {
    return undefined
  }
  if (!reference) {
    return value
  }
  //  Format
  let formattedValue
  switch (reference) {
    case DATE.id:
      formattedValue = moment.utc(value).format(getDateFormat({
        format: optionalFormat
      }))
      break
    case DATE_PLUS_TIME.id:
      formattedValue = moment.utc(value).format(getDateFormat({
        isTime: true
      }))
      break
    case TIME.id:
      formattedValue = moment.utc(value).format(getDateFormat({
        isTime: true
      }))
      break
    case AMOUNT.id:
      formattedValue = formatPrice(value)
      break
    case COSTS_PLUS_PRICES.id:
      formattedValue = formatPrice(value)
      break
    case NUMBER.id:
      formattedValue = formatQuantity(value)
      break
    case QUANTITY.id:
      formattedValue = formatQuantity(value)
      break
    default:
      formattedValue = value
  }
  return formattedValue
}

// Format percentage based on Intl library
export function formatPercent(number: number): string | undefined {
  if (!number) {
    return undefined
  }
  //  Get formatted number
  return new Intl.NumberFormat(getCountryCode(), {
    style: 'percent'
  }).format(number)
}

// Format a date with specific format, if format is void use default date format for language
export function formatDate(date: moment.MomentInput, isTime?: boolean): string | undefined {
  isTime = isTime || false
  if (!date) {
    return undefined
  }
  //  Format
  return moment.utc(date).format(getDateFormat({
    isTime
  }))
}

/**
 * Removes the % of a text string, only from the beginning and end if they exist,
 * this in case you need to use a match or local search to find matches between
 * text strings.
 * @param {string} stringToParsed ej: '%qwerty asd%' | '%zxc 123'
 * @returns {string} ej: 'qwerty asd' | 'zxc 123'
 */
export function trimPercentage(stringToParsed: string): string {
  if ((stringToParsed) && String(stringToParsed).includes('%')) {
    let parsedValue = stringToParsed
    if (parsedValue[0] === '%') {
      parsedValue = parsedValue.slice(1)
    }

    const wordSize = parsedValue.length - 1
    if (parsedValue[wordSize] === '%') {
      parsedValue = parsedValue.slice(0, wordSize)
    }
    return parsedValue
  }
  return stringToParsed
}
