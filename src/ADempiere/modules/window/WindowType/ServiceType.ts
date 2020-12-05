import {
  IChatEntryData,
  IDocumentActionData,
  IDocumentStatusData,
  IEntityChatData,
  IEntityLogData,
  IWorkflowDefinitionData,
  IWorkflowProcessData
} from './DomainType'

export interface IWorkflowParams {
    tableName: string
    pageToken: string
    pageSize: number
}
// Get list of log for a records
export interface IWorkflowExtendedParams extends IWorkflowParams {
    recordId: number
    recordUuid: string
}

export interface IListEntityLogsResponse {
    nextPageToken: string
    recordCount: number
    entityLogsList: IEntityLogData
}

export interface IListWorkflowsLogsResponse {
    nextPageToken: string
    recordCount: number
    workflowLogsList: IWorkflowProcessData[]
}

export interface IListWorkflowsResponse {
    nextPageToken: string
    recordCount: number
    workflowsList: IWorkflowDefinitionData[]
}

export interface IListEntityChatsParams {
    tableName: string
    recordId: number
    recordUuid: string
    pageToken: string
    pageSize: string
}

export interface IListEntityChatsResponse {
    nextPageToken: string
    recordCount: number
    entityChatsList: IEntityChatData[]
}

export interface IListChatEntriesParams {
    id: number
    uuid: string
    pageToken: string
    pageSize: number
}

export interface IListChatEntriesResponse {
    nextPageToken: string
    recordCount: number
    chatEntriesList: IChatEntryData[]
}

export interface ICreateChatEntryParams {
    tableName: string
    recordId: number
    recordUuid: string
    comment: string
}

export interface IListDocumentsParams extends IWorkflowExtendedParams {
    documentStatus: string
    documentAction: string
}

export interface IListDocumentStatusesResponse {
    nextPageToken: string
    recordCount: number
    documentStatusesList: IDocumentStatusData[]
}

export interface IListDocumentActionsResponse {
    nextPageToken: string
    recordCount: number
    defaultDocumentAction: IDocumentActionData
    documentActionsList: IDocumentActionData[]
}
