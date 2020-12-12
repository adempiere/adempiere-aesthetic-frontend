import { EventType } from '@/ADempiere/modules/window'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IKeyValueObject } from '@/ADempiere/shared/utils/types'
import { IValueData } from '@/ADempiere/modules/core'
import { IPrivateAccessData } from '@/ADempiere/modules/privateAccess'
import { IContextInfoValuesResponse } from '@/ADempiere/modules/ui'

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

// Language
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

// Persistence
export interface PersistenceState {
    persistence: {
        [columnName: string]: Map<String, KeyValueData<IValueData>>
    }
}

// Business Data
export interface IContextInfoValuesExtends extends IContextInfoValuesResponse {
    contextInfoUuid: string
    sqlStatement: string
}

export interface IRecordObjectListFromCriteria {
    defaultValues: IKeyValueObject<String>
    values: KeyValueData<IValueData>[]
    // datatables attributes
    isNew: boolean
    isEdit: boolean
    isReadOnlyFromRow: boolean
}

export interface IRecordSelectionData {
    parentUuid?: string
    containerUuid: string
    record: any[]
    selection: any[]
    pageNumber: number
    recordCount: number
    nextPageToken?: string
    originalNextPageToken?: string
    panelType?: PanelContextType
    isLoaded: boolean
    isLoadedContext: boolean
    query?: string
    whereClause?: string
    orderByClause?: string
}

export interface ISelectionToServerData {
    selectionId: string
    selectionValues: KeyValueData[]
}

export interface IPrivateAccessDataExtended extends IPrivateAccessData {
    isLocked: boolean
    isPrivateAccess?: boolean
}

export interface BusinessDataState {
    recordSelection: IRecordSelectionData[] // record data and selection
    contextInfoField: IContextInfoValuesExtends[]
    recordPrivateAccess: Partial<IPrivateAccessDataExtended>
}

// Window
export interface WindowState {
    inCreate: {
        containerUuid: string
    }[]
    references: []
    currentRecord: {}
    windowOldRoute: {
        path: string
        fullPath: string
        query: {}
    }
    dataLog: {
        containerUuid: string
        recordId: number
        tableName: string
        eventType?: EventType
    }
    tabSequenceRecord: []
    totalResponse: number
    totalRequest: number
}
