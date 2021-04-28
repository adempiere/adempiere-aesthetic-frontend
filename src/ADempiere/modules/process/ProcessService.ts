import { IPanelParameters } from '@/ADempiere/shared/store/modules/panel/type'
import { request } from '@/ADempiere/shared/utils/request'
import {
  IProcessRequestData,
  convertProcessLog,
  IProcessLogData,
  IProcessListData,
  IProcessLogListData
} from '.'
import { KeyValueData } from '../persistence'

/**
 * Request a process
 * @param {IProcessData} requestData
 */
export function requestRunProcess(
  requestData: IProcessRequestData
): Promise<IProcessLogData> {
  const {
    uuid,
    tableName,
    recordId,
    recordUuid,
    isSummary,
    reportType,
    tableSelectedId,
    reportViewUuid,
    parametersList,
    selectionsList,
    printFormatUuid
  } = requestData
  let parameters: KeyValueData[] = []
  parameters = parametersList.map((parameter: IPanelParameters) => {
    return {
      key: parameter.columnName,
      value: parameter.value
    }
  })
  return request({
    url: '/data/process',
    method: 'POST',
    data: {
      process_uuid: uuid,
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      is_summary: isSummary,
      report_type: reportType,
      table_selected_id: tableSelectedId,
      report_view_uuid: reportViewUuid,
      parameters,
      selections: selectionsList,
      print_format_uuid: printFormatUuid
    }
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
