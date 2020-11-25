import { IValueData } from '@/ADempiere/modules/core'
import { IReportOutputData } from '@/ADempiere/modules/report'

export interface IProcessLogData {
    uuid: string
    instanceUuid: string
    isError: boolean
    summary: string
    resultTableName: string
    isProcessing: boolean
    lastRun: number
    parametersList?: any
    parameters?: IValueData[]
    output: IReportOutputData
}

type ParameterData = {
    key: string
    value: any
}

export interface IProcessRequestData {
    processUuid: string
    tableName: string
    id: number
    uuid: string
    isSummary: boolean
    reportType: string
    tableSelectedId: number
    reportViewUuid: string
    parameters: ParameterData[]
    selections: any[]
    printFormatUuid: string
}

export interface IProcessListData {
    instanceUuid: string
    userUuid: string
    tableName: string
    recordId: number
    recordUuid: string
    pageSize: number
    pageToken: string
}

export interface IProcessLogListData {
    recordCount: number
    processLogsList: IProcessLogData[]
    nextPageToken: string
}
