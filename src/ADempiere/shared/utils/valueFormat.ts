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
