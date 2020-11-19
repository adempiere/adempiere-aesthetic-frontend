export interface IReportOutputData {
  uuid: string
  name: string
  description: string
  fileName: string
  output: string
  mimeType: string
  dataCols: number
  dataRows: number
  headerName: string
  footerName: string
  printFormatUuid: string
  reportViewUuid: string
  tableName: string
  outputStream: any // type byte
  // outputStreamAsB64
  outputStreamAsB64: any // Type not found in proto
  // outputStreamAsU8
  outputStreamAsU8: any /// Type not found in proto
  reportType: string
}

export interface IPrintFormatData {
  id?: number
  uuid: string
  name: string
  description: string
  tableName: string
  isDefault: boolean
  reportViewUuid: string
}

export interface IListPrintsFormatsData {
  recordCount: number
  records: IPrintFormatData[]
  nextPageToken: string
}

export interface IDrillTablesData {
  tableName: string
  printName: string
}

export interface IReportViewData {
  uuid: string
  name: string
  description: string
  tableName: string
  reportViewUuid?: string
}

// Services types

export interface IListReportDrillTablesRequest{
  tableName: string
  pageToken: string
  pageSize: number
}

export interface IListReportsViewsRequest extends IListReportDrillTablesRequest {
  processUuid: string
}

export interface IListPrintsFormatsRequest extends IListReportsViewsRequest {
  reportViewUuid: string
}

export interface IListReportOutputRequest {
  tableName: string
  printFormatUuid: string
  reportViewUuid: string
  isSummary: boolean
  reportName: string
  reportType: string
  parametersList: any
  // query criteria
  query: string
  whereClause: string
  orderByClause: string
}

interface IReportDrillTableResponse{
  drillTablesList: IDrillTablesData[]
  nextPageToken: string
  recordCount: number
}

interface IReportsViewResponse {
  reportViewsList: IReportViewData[]
  nextPageToken: string
  recordCount: number
}
