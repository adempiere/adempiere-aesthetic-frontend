import { EventType } from '@/ADempiere/modules/window';

export interface IEntityData {
    id: number
    uuid: string
    tableName: string
    attributes: any
}

export interface IEntityListData {
    nextPageToken: string
    recordCount: number
    recordsList: IEntityData[]
}

export interface ITranslationData {
    language: string
    uuid: string
    values: any
}

// Service types

export type IAttributeData = {
    columnName: string
    value: any
};

export type KeyValueData = {
    key: string
    value: any
};

export interface IEntityRequestParams {
    tableName: string
    attributesList: IAttributeData[]
}

export interface IDeleteEntityParams {
    tableName: string
    id: number
    uuid: string
}

export interface IRollbackEntityParams {
    id: number
    uuid: string
    tableName: string
    eventType?: EventType
}

export interface IListEntitiesParams {
    tableName: string
    query?: string
    whereClause: string
    conditionsList?: any[]
    columnsList?: any[]
    orderByClause?: string
    limit?: number
    pageToken?: string
    pageSize?: number
}

export interface ITranslationRequestParams {
    tableName: string
    language: string
    uuid: string
    id: number
    pageToken: string
    pageSize: number
}

export interface ITranslationResponseData {
    nextPageToken: string
    recordCount: number
    translationsList: ITranslationData[]
}

export interface IResourceParams {
    resourceUuid: string
}

export interface IResourceCallbacksParams {
    onData: Function
    onStatus: Function
    onEnd: Function
}

export interface IResponseImageData {
    url: string
    method: string
    responseType: string
}
