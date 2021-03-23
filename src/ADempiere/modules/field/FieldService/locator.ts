import {
  ILocatorData,
  requestListEntities
} from '@/ADempiere/modules/persistence'
import { convertArrayKeyValueToObject } from '@/ADempiere/shared/utils/valueFormat'

const tableName = 'M_Locator'

interface ILocatorListParams {
    warehouseId: number
}

export function getLocatorList(
  data: ILocatorListParams
): Promise<ILocatorData[]> {
  const { warehouseId } = data

  return new Promise<ILocatorData[]>(resolve => {
    return requestListEntities({
      tableName,
      whereClause: `M_Warehouse_ID = ${warehouseId}`
    }).then(locatorData => {
      const locatorList: ILocatorData[] = []
      if (locatorData) {
        locatorData.recordsList.map(record => {
          const attributesObj = convertArrayKeyValueToObject({
            array: record.attributes,
            keyName: 'key'
          })
          locatorList.push({
            id: record.id,
            value: attributesObj.Value,
            warehouseId: attributesObj.M_Warehouse_ID,
            rack: attributesObj.X,
            column: attributesObj.Y,
            level: attributesObj.Z
          })
        })
      }
      resolve(locatorList)
    })
  })
}
