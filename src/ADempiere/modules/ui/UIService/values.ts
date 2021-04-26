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
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'

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
  let filters: any[] = []
  if (!isEmptyValue(value)) {
    filters = [
      {
        value
      }
    ]
  }
  return request({
    url: '/ui/get-lookup-item',
    method: 'POST',
    data: {
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
    url: '/ui/list-lookup-items',
    method: 'POST',
    data: {
      table_name: tableName,
      query,
      where_clause: whereClause,
      filters
    },
    params: {
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
    url: '/ui/list-references',
    method: 'POST',
    data: {
      id: recordId,
      uuid: recordUuid,
      window_uuid: windowUuid,
      table_name: tableName
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then((referencesListResposnse: any) => {
      return convertReferencesList(referencesListResposnse)
    })
}

// Get default value for a field
export function requestDefaultValue(query: any): Promise<IValueData> {
  return request({
    url: '/ui/get-default-value',
    method: 'POST',
    data: {
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
    url: '/ui/get-context-info-value',
    method: 'POST',
    data: {
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
