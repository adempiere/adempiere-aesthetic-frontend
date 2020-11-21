import { ICriteriaData } from '@/ADempiere/modules/core'

export interface IRecentItemData {
    menuUuid: string
    menuName: string
    menuDescription: string
    windowUuid: string
    tabUuid: string
    tableId: number
    tableName: string
    id: number
    uuid: string
    displayName: string
    updated: number
    referenceUuid: string
    action: string
}

export interface IRecentItemResponseData {
    recordCount: number
    recentItemsList: IRecentItemData[]
    nextPageToken: string
}

export interface IFavoriteData {
    menuUuid: string
    menuName: string
    menuDescription: string
    referenceUuid: string
    action: string
}

export interface IDashboardData {
    windowUuid: string
    browserUuid: string
    dashboardName: string
    dashboardDescription: string
    dashboardHtml: string
    columnNo: number
    lineNo: number
    isCollapsible: boolean
    isOpenByDefault: boolean
    isEventRequired: boolean
    fileName: string
}

export interface IPendingDocumentData {
    windowUuid: string
    formUuid: string
    documentName: string
    documentDescription: string
    sequence: number
    recordCount: number
    criteria: ICriteriaData
}

// Service types

export interface ListRecentItemsParams {
    userUuid: string
    roleUuid: string
    pageToken: string
    pageSize: number
}

export interface IFavoriresFromServerParams {
    userId: number
    userUuid: string
    pageToken: string
    pageSize: number
}

export interface IFavoriresFromServerResponse {
    recordCount: number
    favoritesList: IFavoriteData[]
    nextPageToken: string
}

export interface IPendingDocumentsFromServerParams {
    userId: number
    userUuid: string
    roleId: number
    roleUuid: string
    pageToken: string
    pageSize: number
}

export interface IPendingDocumentsFromServerResponse {
    recordCount: number
    pendingDocumentsList: IPendingDocumentData[]
    nextPageToken: string
}

export interface IListDashboardsParams {
    roleId: number
    roleUuid: string
    pageToken: string
    pageSize: number
}

export interface IListDashboardsResponse {
    recordCount: number
    dashboardsList: IDashboardData[]
    nextPageToken: string
}
