// Get Instance for connection
import { request } from '@/ADempiere/shared/utils/request'
import { IValueData } from '@/ADempiere/modules/core'
import { convertLookupItem, convertReferencesList } from '../UIConvert'
import {
  IContextInfoValueParams,
  IContextInfoValuesResponse,
  ILookupItemData,
  ILookupListParams,
  ILookupListResponse,
  ILookupParams,
  IReferenceListData,
  IReferencesListParams
} from '../UITypes'

/**
 * Request a Lookup data from Reference
 * The main attributes that function hope are:
 * @param {string} columnName
 * @param {string} tableName
 * @param {string} directQuery
 * @param {string|number} value
 */

export function requestLookup(data: ILookupParams): Promise<ILookupItemData> {
  const { tableName, directQuery, value } = data
  const filters = [{
    value
  }]
  return request({
    url: '/user-interface/window/lookup-item',
    method: 'GET',
    params: {
      table_name: tableName,
      query: directQuery,
      filters
    }
  }).then((response: any) => {
    return response
  })
}

/**
 * Request a Lookup list data from Reference
 * The main attributes that function hope are:
 * @param {string} tableName
 * @param {string} query
 * @param {string} whereClause
 * @param {array}  valuesList // TODO: Add support
 * @param {string} pageToken
 * @param {number} pageSize
 */

export function requestLookupList(
  data: ILookupListParams
): Promise<ILookupListResponse> {
  data.valuesList = data.valuesList ? data.valuesList : []
  const {
    tableName,
    query,
    whereClause,
    columnName,
    valuesList,
    pageToken,
    pageSize
  } = data
  let filters: any[] = []

  if (!(valuesList.length === 0)) {
    filters = [
      {
        column_name: columnName,
        values: valuesList
      }
    ]
  }

  return request({
    url: '/user-interface/window/lookup-items',
    method: 'GET',
    params: {
      table_name: tableName,
      query,
      where_clause: whereClause,
      filters,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then((lookupListResponse: any) => {
      return {
        nextPageToken: lookupListResponse.next_page_token,
        recordCount: lookupListResponse.record_count,
        list: lookupListResponse.records.map((element: any) => {
          return convertLookupItem(element)
        })
      }
    })
}

/**
 * Reference List from Window
 * @param {string}  tableName
 * @param {string}  windowUuid
 * @param {string}  recordUuid
 * @param {number}  recordId
 */

export function requestReferencesList(
  data: IReferencesListParams
): Promise<IReferenceListData> {
  const {
    windowUuid,
    tableName,
    recordId,
    recordUuid,
    pageSize,
    pageToken
  } = data
  return request({
    url: '/user-interface/window/references',
    method: 'GET',
    params: {
      id: recordId,
      uuid: recordUuid,
      window_uuid: windowUuid,
      table_name: tableName,
      // Page Data
      pageToken: pageToken,
      pageSize: pageSize
    }
  })
    .then((referencesListResposnse: any) => {
      // console.log('referencesListResponse')
      // console.log(referencesListResposnse)
      return convertReferencesList(referencesListResposnse)
    })
}

// Get default value for a field
export function requestDefaultValue(query: any): Promise<IValueData> {
  return request({
    url: '/user-interface/window/default-value',
    method: 'GET',
    params: {
      query
    }
  })
    .then(response => {
      return <IValueData>response
    })
}

/**
 * Get context information for a window, tab or field
 * @param {string} query
 * @param {string} uuid
 * @param {number} id
 */

export function requestGetContextInfoValue(
  data: IContextInfoValueParams
): Promise<IContextInfoValuesResponse> {
  const { query, uuid, id } = data
  return request({
    url: '/user-interface/window/context-info-value',
    method: 'GET',
    params: {
      query,
      uuid,
      id
    }
  })
    .then(contextInfoValueResponse => {
      return {
        messageText: contextInfoValueResponse.message_text,
        messageTip: contextInfoValueResponse.message_tip
      }
    })
}
