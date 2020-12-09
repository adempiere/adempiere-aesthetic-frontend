// Get Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/ADempiere/shared/services/instances'
import { IRequestImageData } from '@/ADempiere/shared/utils/types'
import { getImagePath } from '@/ADempiere/shared/utils/resource'
import {
  convertEntity,
  convertEntityList,
  convertTranslation
} from '../PersistenceConvert'
import {
  IAttributeData,
  IDeleteEntityParams,
  IEntityData,
  IEntityListData,
  IEntityRequestParams,
  IListEntitiesParams,
  IResourceCallbacksParams,
  IResourceParams,
  IRollbackEntityParams,
  ITranslationRequestParams,
  ITranslationResponseData,
  KeyValueData
} from '../PersistenceType'
import { AxiosPromise } from 'axios'
import { EventEmitter } from 'events'

/**
 * Create entity
 * @param {string}  tableName
 * @param {array}   attributesList
 */

export function requestCreateEntity(
  data: IEntityRequestParams
): Promise<IEntityData> {
  const { attributesList, tableName } = data
  const newAttributesList = attributesList.map(
    (parameter: IAttributeData): KeyValueData => {
      return {
        key: parameter.columnName,
        value: parameter.value
      }
    }
  )

  return requestRest({
    url: '/data/create',
    data: {
      table_name: tableName,
      attributes: newAttributesList
    }
  })
    .then(evaluateResponse)
    .then(entityCreateResponse => {
      return convertEntity(entityCreateResponse)
    })
}

export function requestUpdateEntity(data: IEntityData): Promise<IEntityData> {
  const { tableName, id, uuid, attributes } = data
  const attributesList = attributes.map(
    (parameter: IAttributeData): KeyValueData => {
      return {
        key: parameter.columnName,
        value: parameter.value
      }
    }
  )

  return requestRest({
    url: '/data/update',
    data: {
      table_name: tableName,
      id,
      uuid,
      attributes: attributesList
    }
  })
    .then(evaluateResponse)
    .then(entityUpdateResponse => {
      return convertEntity(entityUpdateResponse)
    })
}

export function requestDeleteEntity(data: IDeleteEntityParams): Promise<any> {
  const { uuid, id, tableName } = data
  return requestRest({
    url: '/data/delete',
    data: {
      table_name: tableName,
      id,
      uuid
    }
  }).then(evaluateResponse)
}

export function rollbackEntity(
  data: IRollbackEntityParams
): Promise<IEntityData> {
  const { tableName, id, uuid, eventType } = data
  return requestRest({
    url: '/data/rollback-entity',
    data: {
      table_name: tableName,
      id,
      uuid,
      event_type: eventType
    }
  })
    .then(evaluateResponse)
    .then(entityResponse => {
      return convertEntity(entityResponse)
    })
}

// Get entity from table name and record id or record uuid
export function requestGetEntity(
  data: IDeleteEntityParams
): Promise<IEntityData> {
  const { id, uuid, tableName } = data
  return requestRest({
    url: '/data/entity',
    method: 'get',
    params: {
      table_name: tableName,
      uuid,
      id
    }
  })
    .then(evaluateResponse)
    .then(entityResponse => {
      return convertEntity(entityResponse)
    })
}

export function requestListEntities(
  data: IListEntitiesParams
): Promise<IEntityListData> {
  const {
    tableName,
    query,
    whereClause,
    conditionsList,
    columnsList,
    orderByClause,
    limit,
    pageToken,
    pageSize
  } = data

  let filters: any[] = []
  if (conditionsList) {
    filters = conditionsList.map((condition: any) => {
      const { value, operator, columnName, valueTo, values } = condition
      return {
        column_name: columnName,
        value,
        operator,
        value_to: valueTo,
        values
      }
    })
  }

  return requestRest({
    url: '/data/list',
    data: {
      table_name: tableName,
      // DSL Query
      filters,
      columns: columnsList,
      // Custom Query
      query,
      where_clause: whereClause,
      order_by_clause: orderByClause,
      limit
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
    .then(entitiesListResponse => {
      return convertEntityList(entitiesListResponse)
    })
}

export function requestTranslations(
  data: ITranslationRequestParams
): Promise<ITranslationResponseData> {
  const { tableName, language, uuid, id, pageSize, pageToken } = data
  return requestRest({
    url: '/ui/list-translations',
    data: {
      table_name: tableName,
      id,
      uuid
    },
    params: {
      language,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
    .then(languageListResponse => {
      return {
        nextPageToken: languageListResponse.next_page_token,
        recordCount: languageListResponse.record_count,
        list: languageListResponse.records.map(
          (record: any) => {
            return convertTranslation(record)
          }
        )
      }
    })
}

// Download a resource from file name
export function requestResource(
  data: IResourceParams,
  callBack: IResourceCallbacksParams
): Promise<any> {
  const { resourceUuid } = data
  const stream = requestRest({
    url: '/resource',
    method: 'get',
    params: {
      resource_uuid: resourceUuid
    }
  })
  const emmiter: EventEmitter = new EventEmitter()

  emmiter.on('data', response => callBack.onData(response))

  emmiter.on('status', status => callBack.onStatus(status))
  emmiter.on('end', end => callBack.onEnd(end))

  return stream
}

export function requestImage(data: IRequestImageData): AxiosPromise<any> {
  const { file, width, height, operation } = data
  const { urn } = getImagePath({
    file,
    width,
    height,
    operation
  })

  return requestRest({
    url: urn,
    method: 'get',
    responseType: 'arraybuffer'
  })
}
