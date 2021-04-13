import { request } from '@/ADempiere/shared/utils/request'
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
  return request({
    url: '/data/process',
    method: 'POST',
    data: requestData
  })
    .then(processRunResponse => {
      return convertProcessLog(processRunResponse)
    })
}

export function requestListProcessesLogs(
  requestData: IProcessListData
): Promise<IProcessLogListData> {
  return request({
    url: '/logs/list-process-logs',
    method: 'POST',
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
