import { IResourceReferenceData } from '@/ADempiere/modules/pos'
import { IValueData } from '@/ADempiere/modules/core'
import { IKeyValueObject } from '@/ADempiere/shared/utils/types'
import { IPanelParameters } from '@/ADempiere/shared/store/modules/panel/type'

export interface IResourceReferenceParams {
    recordId: number
    recordUuid: string
}

export interface IAttachmentParams {
    tableName: string
    recordId: number
    recordUuid: string
}

export interface ILookupItemData {
    id: number
    uuid: string
    tableName: string
    values: IKeyValueObject<IValueData>
}

export interface IAttachmentData {
    attachmentUuid: string
    title: string
    textMsg: string
    resourceReferences: IResourceReferenceData[]
}

export interface ICallOutParams {
    windowUuid: string
    windowNo: number
    tabUuid: string
    tableName: string
    columnName: string
    value: any
    oldValue: any
    callout: string
    attributesList?: IPanelParameters[]
}

export interface ICallOutData {
    result: string
    values: Map<String, IValueData>
}

export interface IReferenceData {
    uuid?: string
    tableName: string
    windowUuid: string
    displayName: string
    whereClause: string // Not found in proto
    recordCount: any // Not Found in proto
}

export interface IReferenceListData {
    recordCount: number
    list: IReferenceData[]
    nextPageToken: string
}

export interface ILookupParams {
    tableName: string
    directQuery: string
    value: string | number
}

export interface ILookupListParams {
    tableName: string
    query: string
    whereClause: string
    columnName: string
    valuesList: any[]
    pageToken?: string
    pageSize?: number
}

export interface ILookupListResponse {
    nextPageToken: string
    recordCount: number
    list: ILookupItemData[]
}

export interface IReferencesListParams {
    windowUuid: string
    tableName: string
    recordId?: number
    recordUuid: string
    pageToken?: string
    pageSize?: number
}

export interface IContextInfoValueParams {
    uuid: string
    id: number
    query: string
}

export interface IContextInfoValuesResponse {
    messageText: string
    messageTip: string
}

// VUEX

// Lookup
export interface ILookupOptions {
    label: IValueData
    uuid?: string
    id: string | number
}

export interface ILookupItemDataExtended {
    option: Required<ILookupOptions>
    value: IValueData
    parsedDirectQuery: string
    tableName: string
    sessionUuid: string
    clientId: number
}

export interface ILookupListExtended {
    list: ILookupOptions[]
    tableName: string
    parsedQuery: string
    sessionUuid: string
    clientId: number
}

export interface LookupState {
    lookupItem: ILookupItemDataExtended[]
    lookupList: ILookupListExtended[]
}

// CallOut
export type CallOutControlState = any
