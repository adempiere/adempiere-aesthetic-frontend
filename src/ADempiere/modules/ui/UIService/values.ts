// Get Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/ADempiere/shared/services/instances'
import { IValueData } from '@/ADempiere/modules/core'
import { convertReferencesList } from '../UIConvert'
import {
  IContextInfoValueParams,
  IContextInfoValuesResponse,
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

export function requestLookup(data: ILookupParams) {
  const { columnName, tableName, directQuery, value } = data
  let filters: any[] = []
  if (!value) {
    filters = [
      {
        column_name: columnName,
        value
      }
    ]
  }
  return requestRest({
    url: '/ui/get-lookup-item',
    data: {
      table_name: tableName,
      query: directQuery,
      filters
    }
  }).then(evaluateResponse)
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

  if (valuesList === []) {
    filters = [
      {
        column_name: columnName,
        values: valuesList
      }
    ]
  }

  return requestRest({
    url: '/ui/list-lookup-items',
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
    .then(evaluateResponse)
    .then((lookupListResponse: any) => {
      return {
        nextPageToken: lookupListResponse.next_page_token,
        recordCount: lookupListResponse.record_count,
        recordsList: lookupListResponse.records
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
  return requestRest({
    url: '/ui/list-references',
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
    .then(evaluateResponse)
    .then((referencesListResposnse: any) => {
      return convertReferencesList(referencesListResposnse)
    })
}

// Get default value for a field
export function requestDefaultValue(query: any): Promise<IValueData> {
  return requestRest({
    url: '/ui/get-default-value',
    data: {
      query
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: '/ui/get-context-info-value',
    data: {
      query,
      uuid,
      id
    }
  })
    .then(evaluateResponse)
    .then(contextInfoValueResponse => {
      return {
        messageText: contextInfoValueResponse.message_text,
        messageTip: contextInfoValueResponse.message_tip
      }
    })
}
