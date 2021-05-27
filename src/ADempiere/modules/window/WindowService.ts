// Get Instance for connection
import { request } from '@/ADempiere/shared/utils/request'
import { IResponseList } from '@/ADempiere/shared/utils/types'
import {
  convertChatEntry,
  convertEntityChat,
  convertEntityLog,
  convertWorkflowDefinition,
  convertWorkflowProcess
} from './WindowConvert'
import { IChatEntryData, IWorkflowProcessData } from './WindowType/DomainType'
import { IWorkflowExtendedParams, IListEntityLogsResponse, IWorkflowParams, IListWorkflowsResponse, IListEntityChatsResponse, IListChatEntriesParams, IListChatEntriesResponse, ICreateChatEntryParams, IListDocumentsParams, IListDocumentStatusesResponse, IListDocumentActionsResponse } from './WindowType/ServiceType'

export function requestListEntityLogs(
  data: IWorkflowExtendedParams
): Promise<IListEntityLogsResponse> {
  const { tableName, recordId, recordUuid, pageToken, pageSize } = data
  return request({
    url: '/user/log/entity-logs',
    method: 'GET',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then((entityLogsListResponse: any) => {
      return {
        nextPageToken: entityLogsListResponse.next_page_token,
        recordCount: entityLogsListResponse.record_count,
        list: entityLogsListResponse.records.map(
          (entityLog: any) => {
            return convertEntityLog(entityLog)
          }
        )
      }
    })
}

// Get workflow log for a record
export function requestListWorkflowsLogs(data: IWorkflowExtendedParams): Promise<IResponseList<IWorkflowProcessData>> {
  const { tableName, recordUuid, recordId, pageSize, pageToken } = data
  return request({
    url: '/user/log/workflow-logs',
    method: 'GET',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then((workflowLogsListResponse: any) => {
      return {
        nextPageToken: workflowLogsListResponse.next_page_token,
        recordCount: workflowLogsListResponse.record_count,
        list: workflowLogsListResponse.records.map(
          (workflowLog: any) => {
            return convertWorkflowProcess(workflowLog)
          }
        )
      }
    })
}

// Get workflow list for a document
export function requestListWorkflows(
  data: IWorkflowParams
): Promise<IListWorkflowsResponse> {
  const { tableName, pageToken, pageSize } = data
  return request({
    url: '/user/log/workflow-logs',
    method: 'GET',
    params: {
      table_name: tableName,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then((workflowListResponse: any) => {
      return {
        nextPageToken: workflowListResponse.next_page_token,
        recordCount: workflowListResponse.record_count,
        list: workflowListResponse.records.map(
          (workflowDefinition: any) => {
            return convertWorkflowDefinition(workflowDefinition)
          }
        )
      }
    })
}

/**
 * @param {string}  tableName
 * @param {integer} recordId
 * @param {string}  pageToken
 * @param {string}  pageSize
 */

export function requestListEntityChats(
  data: IWorkflowExtendedParams
): Promise<IListEntityChatsResponse> {
  const { tableName, recordId, recordUuid, pageSize, pageToken } = data
  return request({
    url: '/user/log/entity-chats',
    method: 'GET',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then((entityChatListResponse: any) => {
      return {
        nextPageToken: entityChatListResponse.next_page_token,
        recordCount: entityChatListResponse.record_count,
        list: entityChatListResponse.records.map(
          (entityChat: any) => {
            return convertEntityChat(entityChat)
          }
        )
      }
    })
}

export function requestListChatsEntries(
  data: IListChatEntriesParams
): Promise<IListChatEntriesResponse> {
  const { id, uuid, pageToken, pageSize } = data
  return request({
    url: '/logs/list-chat-entries',
    method: 'GET',
    params: {
      id,
      uuid,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then((chatEntriesListResponse: any) => {
      return {
        nextPageToken: chatEntriesListResponse.next_page_token,
        recordCount: chatEntriesListResponse.record_count,
        chatEntriesList: chatEntriesListResponse.records.map(
          (chatEntry: any) => {
            return convertChatEntry(chatEntry)
          }
        )
      }
    })
}

/**
 * @param {string} tableName
 * @param {string} recordId
 * @param {string} recordUuid
 * @param {string} comment
 */
export function requestCreateChatEntry(
  data: ICreateChatEntryParams
): Promise<IChatEntryData> {
  const { tableName, recordUuid, recordId, comment } = data
  return request({
    url: '/user-interface/component/notes/create-chat-entry',
    method: 'POST',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      comment: comment
    }
  })
    .then((chatEntryResponse: any) => {
      return convertChatEntry(chatEntryResponse)
    })
}

/**
 * Request Document Status List
 * @param {string} tableName
 * @param {number} recordId
 * @param {string} recordUuid
 * @param {string} documentStatus
 * @param {string} documentAction
 * @param {number} pageSize
 * @param {string} pageToken
 */

export function requestListDocumentStatuses(
  data: IListDocumentsParams
): Promise<IListDocumentStatusesResponse> {
  const {
    tableName,
    recordId,
    recordUuid,
    documentStatus,
    pageSize,
    pageToken
  } = data
  return request({
    url: '/workflow/document-statuses',
    method: 'GET',
    params: {
      id: recordId,
      uuid: recordUuid,
      table_name: tableName,
      document_status: documentStatus,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then((listDocumentsActionsResponse: any) => {
      return {
        nextPageToken: listDocumentsActionsResponse.next_page_token,
        recordCount: listDocumentsActionsResponse.record_count,
        documentStatusesList: listDocumentsActionsResponse.records
      }
    })
}

// Request a document action list from current status of document
export function requestListDocumentActions(
  data: IListDocumentsParams
): Promise<IListDocumentActionsResponse> {
  const {
    recordUuid,
    recordId,
    tableName,
    documentStatus,
    documentAction,
    pageToken,
    pageSize
  } = data
  return request({
    url: '/workflow/document-actions',
    method: 'GET',
    data: {
      id: recordId,
      uuid: recordUuid,
      table_name: tableName,
      document_action: documentAction,
      document_status: documentStatus,
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then((listDocumentsActionsResponse: any) => {
      return {
        nextPageToken: listDocumentsActionsResponse.next_page_token,
        recordCount: listDocumentsActionsResponse.record_count,
        defaultDocumentAction: {
          ...listDocumentsActionsResponse.default_document_action
        },
        documentActionsList: listDocumentsActionsResponse.records
      }
    })
}
