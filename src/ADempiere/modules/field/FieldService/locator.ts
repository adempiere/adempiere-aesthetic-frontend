import {
  IEntityListData,
  requestListEntities
} from '@/ADempiere/modules/persistence'

const tableName = 'M_Locator'

interface ILocatorListParams {
    warehouseId: number
}

export function requestLocatorList(
  data: ILocatorListParams
): Promise<IEntityListData> {
  const { warehouseId } = data

  return requestListEntities({
    tableName,
    whereClause: `M_Warehouse_ID = ${warehouseId}`
  })
}
