// Get Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/ADempiere/shared/services/instances'
import {
  convertChatEntry,
  convertEntityChat,
  convertEntityLog,
  convertWorkflowDefinition,
  convertWorkflowProcess
} from './WindowConvert'
import { IChatEntryData } from './WindowType/DomainType'
import { IWorkflowExtendedParams, IListEntityLogsResponse, IWorkflowParams, IListWorkflowsResponse, IListEntityChatsResponse, IListChatEntriesParams, IListChatEntriesResponse, ICreateChatEntryParams, IListDocumentsParams, IListDocumentStatusesResponse, IListDocumentActionsResponse } from './WindowType/ServiceType'

export function requestListEntityLogs(
  data: IWorkflowExtendedParams
): Promise<IListEntityLogsResponse> {
  const { tableName, recordId, recordUuid, pageToken, pageSize } = data
  return requestRest({
    url: '/logs/list-entity-logs',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
    .then((entityLogsListResponse: any) => {
      return {
        nextPageToken: entityLogsListResponse.next_page_token,
        recordCount: entityLogsListResponse.record_count,
        entityLogsList: entityLogsListResponse.records.map(
          (entityLog: any) => {
            return convertEntityLog(entityLog)
          }
        )
      }
    })
}

// Get workflow log for a record
export function requestListWorkflowsLogs(data: IWorkflowExtendedParams) {
  const { tableName, recordUuid, recordId, pageSize, pageToken } = data
  return requestRest({
    url: '/logs/list-workflow-logs',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
    .then((workflowLogsListResponse: any) => {
      return {
        nextPageToken: workflowLogsListResponse.next_page_token,
        recordCount: workflowLogsListResponse.record_count,
        workflowLogsList: workflowLogsListResponse.records.map(
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
  return requestRest({
    url: '/workflow/list-workflow',
    data: {
      table_name: tableName
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
    .then((workflowListResponse: any) => {
      return {
        nextPageToken: workflowListResponse.next_page_token,
        recordCount: workflowListResponse.record_count,
        workflowsList: workflowListResponse.records.map(
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
  return requestRest({
    url: '/logs/list-entity-chats',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
    .then((entityChatListResponse: any) => {
      return {
        nextPageToken: entityChatListResponse.next_page_token,
        recordCount: entityChatListResponse.record_count,
        entityChatsList: entityChatListResponse.records.map(
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
  return requestRest({
    url: '/logs/list-chat-entries',
    data: {
      id,
      uuid
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: '/ui/create-chat-entry',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      comment: comment
    }
  })
    .then(evaluateResponse)
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
    documentAction,
    documentStatus,
    pageSize,
    pageToken
  } = data
  return requestRest({
    url: '/workflow/list-document-actions',
    data: {
      id: recordId,
      uuid: recordUuid,
      table_name: tableName,
      document_action: documentAction,
      document_status: documentStatus
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: '/workflow/list-document-actions',
    data: {
      id: recordId,
      uuid: recordUuid,
      table_name: tableName,
      document_action: documentAction,
      document_status: documentStatus
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
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
