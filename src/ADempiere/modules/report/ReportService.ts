// Get Instance for connection
import { request } from '@/ADempiere/shared/utils/request'
import {
  convertReportView,
  convertReportOutput,
  convertDrillTables,
  convertListPrintFormats
} from '@/ADempiere/modules/report/ReportConvert'
import {
  IListPrintsFormatsData,
  IListReportsViewsRequest,
  IReportsViewResponse,
  IListPrintsFormatsRequest,
  IListReportDrillTablesRequest,
  IListReportOutputRequest,
  IReportOutputData,
  IReportDrillTableResponse
} from './ReportType'

/**
 * Request Pending Documents List
 * @param {string} tableName
 * @param {string} processUuid
 */

export function requestListReportsViews(
  data: IListReportsViewsRequest
): Promise<IReportsViewResponse> {
  const { tableName, processUuid, pageToken, pageSize } = data
  return request({
    url: '/ui/list-report-views',
    method: 'POST',
    data: {
      table_name: tableName,
      process_uuid: processUuid
    },
    params: {
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(reportViewResponse => {
      return {
        nextPageToken: reportViewResponse.next_page_token,
        recordCount: reportViewResponse.record_count,
        list: reportViewResponse.records.map(
          (drill: any) => {
            return convertReportView(drill)
          }
        )
      }
    })
}

// Get print formats from table name, report view uuid or process uuid
export function requestListPrintFormats(
  data: IListPrintsFormatsRequest
): Promise<IListPrintsFormatsData> {
  const { tableName, processUuid, reportViewUuid, pageToken, pageSize } = data
  return request({
    url: '/ui/list-print-formats',
    method: 'POST',
    data: {
      table_name: tableName,
      report_view_uuid: reportViewUuid,
      process_uuid: processUuid
    },
    params: {
      page_token: pageToken,
      page_size: pageSize
    }
  })
    .then(responseListPrintFormats => {
      return convertListPrintFormats(responseListPrintFormats)
    })
}

// Get drill tables for a report
export function requestListDrillTables(
  data: IListReportDrillTablesRequest
): any /* Promise<IReportDrillTableResponse> */ {
  const { tableName, pageToken, pageSize } = data
  return request({
    url: '/ui/list-drill-tables',
    method: 'POST',
    data: {
      table_name: tableName
    },
    params: {
      page_token: pageToken,
      page_size: pageSize
    }
  }).then((drillTablesResponse: any) => {
    const list = drillTablesResponse.records.map((drill: any) => {
      return convertDrillTables(drill)
    })
    const output: IReportDrillTableResponse = {
      list,
      nextPageToken: drillTablesResponse.next_page_token,
      recordCount: drillTablesResponse.record_count
    }
    return output
  })
}

// Get report output from parameters
export function requestGetReportOutput(
  data: IListReportOutputRequest
): Promise<IReportOutputData> {
  return request({
    url: '/ui/get-report-output',
    method: 'POST',
    data: {
      table_name: data.tableName,
      // reference
      print_format_uuid: data.printFormatUuid,
      report_view_uuid: data.reportViewUuid,
      is_summary: data.isSummary,
      report_name: data.reportName,
      report_type: data.reportType,
      // DSL Query
      filters: data.parametersList,
      // Custom Query
      query: data.query,
      where_clause: data.whereClause,
      order_by_clause: data.orderByClause
    }
  })
    .then(reportOutpuResponse => {
      return convertReportOutput(reportOutpuResponse)
    })
}
