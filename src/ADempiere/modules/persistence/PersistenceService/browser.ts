// Get Instance for connection
import { request } from '@/ADempiere/shared/utils/request'
import { convertEntityList } from '@/ADempiere/modules/persistence'
import {
  FilterType,
  IBrowserSearchParams,
  IEntityListData, ParamType
} from '../PersistenceType'
/**
 * Request a browser search
 * @param {string} uuid
 * @param {string} tableName
 * @param {array}  parametersList, This allows follow structure:
 *   [{
 *      columnName,
 *      key
 *   }]
 * @param {array}  filters
 * @param {array}  columns
 * @param {string} query
 * @param {string} whereClause
 * @param {number} limit
 * @param {string} orderByClause
 * @param {string} nextPageToken
 */

export function requestBrowserSearch(
  data: IBrowserSearchParams
): Promise<IEntityListData> {
  data.parametersList = data.parametersList ? [] : data.parametersList
  const {
    limit,
    pageSize,
    pageToken,
    query,
    tableName,
    uuid,
    whereClause,
    orderByClause,
    parametersList
  } = data
  const filters: FilterType[] = parametersList.map(
    (parameter: ParamType) => {
      return {
        key: parameter.columnName,
        value: parameter.value,
        values: parameter.values
      }
    }
  )

  return request({
    url: '/user-interface/smart-browser/browser-items',
    data: {
      // Running Parameters
      uuid,
      table_name: tableName,
      // DSL Query
      filters,
      // Custom Query
      query,
      where_clause: whereClause,
      order_by_clause: orderByClause,
      limit
    },
    params: {
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(responseBrowserSearch => {
      return convertEntityList(responseBrowserSearch)
    })
}
