import { EventType } from '@/ADempiere/modules/window'
import { IKeyValueObject } from '@/ADempiere/shared/utils/types'
import { IValueData } from '../core'

export type KeyValueData<T = any> = {
    key: string
    value: T
}

export interface IEntityData {
    id?: number
    uuid: string
    tableName: string
    attributes: KeyValueData<IValueData>[]
}

export interface IEntityListData {
    nextPageToken: string
    recordCount: number
    recordsList: IEntityData[]
}

export interface ITranslationData {
    language: string
    uuid: string
    values: IKeyValueObject<IValueData>[]
}

// Service types

export type IAttributeData<T = any> = {
    columnName: string
    value: T
}

export interface IEntityRequestParams {
    tableName: string
    attributesList: KeyValueData<IValueData>[]
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
    pageToken?: string
    pageSize?: number
}

export interface ITranslationResponseData {
    nextPageToken: string
    recordCount: number
    list: ITranslationData[]
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

export interface IBrowserSearchParams {
    uuid: string
    parametersList: any[]
    tableName: string
    query: string
    whereClause: string
    orderByClause: string
    limit: number
    pageSize: number
    pageToken: string
}

export type FilterType = {
    key: string
    value: any
    values: any
}

export type ParamType = {
    columnName: string
    value: any
    values: any
}

// VUEX Types

export interface ITranslationDataExtended {
    containerUuid: string
    recordUuid: string
    tableName: string
    recordId: number
    translations: ITranslationData[]
}

export interface LanguageState {
    translationsList: ITranslationDataExtended[]
    currentLanguage: ITranslationDataExtended
}
