import { IKeyValueObject } from './types'

export function camelizeObjectKeys(obj: IKeyValueObject): IKeyValueObject {
  const camelizedObj: IKeyValueObject = Object.assign({}, obj)
  Object.keys(camelizedObj).forEach(k => {
    // eslint-disable-next-line
    const newK = k.replace(/(\_\w)/g, m => m[1].toUpperCase())
    if (newK !== k) {
      camelizedObj[newK] = camelizedObj[k]
      delete camelizedObj[k]
    }
  })
  return camelizedObj
}

export function renameObjectKey(
  obj: IKeyValueObject,
  oldEntry: string | number,
  newEntry: any
) {
  delete Object.assign(obj, { [newEntry]: obj[oldEntry] })[oldEntry]
}
