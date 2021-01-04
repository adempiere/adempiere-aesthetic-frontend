import { IPanelParameters } from '@/ADempiere/shared/store/modules/panel/type'
import { ActionContextType, PrintFormatOptions } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IPrintFormatDataExtended } from '../dictionary'

export interface IReportOutputData {
    uuid: string
    name: string
    description: string
    fileName: string
    output: string
    mimeType?: string
    dataCols?: number
    dataRows?: number
    headerName?: string
    footerName?: string
    printFormatUuid?: string
    reportViewUuid?: string
    tableName?: string
    outputStream?: any // type byte
    // outputStreamAsB64
    outputStreamAsB64?: any // Type not found in proto
    // outputStreamAsU8
    outputStreamAsU8?: any /// Type not found in proto
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
    list: IPrintFormatData[]
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

export interface IListReportDrillTablesRequest {
    tableName?: string
    pageToken?: string
    pageSize?: number
}

export interface IListReportsViewsRequest
    extends IListReportDrillTablesRequest {
    processUuid: string
}

export interface IListPrintsFormatsRequest extends IListReportsViewsRequest {
    reportViewUuid?: string
}

export interface IListReportOutputRequest {
    tableName: string
    printFormatUuid: string
    reportViewUuid: string
    isSummary: boolean
    reportName: string
    reportType: string
    parametersList: IPanelParameters[]
    // query criteria
    query?: string
    whereClause?: string
    orderByClause?: string
}

export interface IReportDrillTableResponse {
    list: IDrillTablesData[]
    nextPageToken: string
    recordCount: number
}

export interface IReportsViewResponse {
    list: IReportViewData[]
    nextPageToken: string
    recordCount: number
}

// VUEX

// Report

export interface IReportFormatItemData {
    containerUuid: string
    printFormatList: Omit<IPrintFormatDataExtended, 'printFormatUuid'>[]
}

export interface IReportViewDataExtended extends IReportViewData {
    type: ActionContextType
    option: PrintFormatOptions
    instanceUuid?: string
    processUuid: string
    processId?: number
    printFormatUuid: string
}

export interface IReportViewItemData {
    containerUuid: string
    viewList: IReportViewDataExtended[]
}

export interface IDrillTablesDataExtended extends IDrillTablesData {
    name: string
    type: ActionContextType
    option: PrintFormatOptions
    instanceUuid: string
    printFormatUuid: string
    reportViewUuid: string
    processUuid: string
    processId: number
}

export interface IDrillTableItemData {
    containerUuid: string
    drillTablesList: IDrillTablesDataExtended[]
}

export interface IReportOutputDataExtended extends IReportOutputData {
    processId: number
    processUuid: string
    isError: boolean
    instanceUuid: string
    isReport: boolean
    option: PrintFormatOptions
    url?: string
}

export interface ReportState {
    reportFormatsList: IReportFormatItemData[]
    reportViewsList: IReportViewItemData[]
    drillTablesList: IDrillTableItemData[]
    reportOutput?: IReportOutputDataExtended
}
