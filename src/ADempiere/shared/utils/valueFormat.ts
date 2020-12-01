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
