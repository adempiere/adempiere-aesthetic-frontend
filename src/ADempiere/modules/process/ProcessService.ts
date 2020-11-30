import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/ADempiere/shared/services/instances'
import {
  IProcessRequestData,
  convertProcessLog,
  IProcessLogData,
  IProcessListData,
  IProcessLogListData
} from '.'

/**
 * Request a process
 * @param {IProcessData} requestData
 */
export function requestRunProcess(
  requestData: IProcessRequestData
): Promise<IProcessLogData> {
  return requestRest({
    url: '/data/process',
    data: requestData
  })
    .then(evaluateResponse)
    .then(processRunResponse => {
      return convertProcessLog(processRunResponse)
    })
}

export function requestListProcessesLogs(
  requestData: IProcessListData
): Promise<IProcessLogListData> {
  return requestRest({
    url: '/logs/list-process-logs',
    data: {
      instance_uuid: requestData.instanceUuid,
      user_uuid: requestData.userUuid,
      table_name: requestData.tableName,
      id: requestData.recordId,
      uuid: requestData.recordUuid
    },
    params: {
      page_size: requestData.pageSize,
      page_token: requestData.pageToken
    }
  })
    .then(evaluateResponse)
    .then(response => {
      return {
        recordCount: response.record_count,
        processLogsList: response.records.map((itemProcess: any) => {
          return convertProcessLog(itemProcess)
        }),
        nextPageToken: response.next_page_token
      }
    })
}
