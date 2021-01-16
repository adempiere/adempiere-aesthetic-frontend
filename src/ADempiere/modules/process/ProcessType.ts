import { IValueData } from '@/ADempiere/modules/core'
import { IReportOutputData } from '@/ADempiere/modules/report'
import { PanelContextType, PrintFormatOptions } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IPanelDataExtended, IPrintFormatChild } from '../dictionary'
import { KeyValueData } from '../persistence'

export interface IProcessInfoLogData {
    recordId: number
    log: string
}

export interface IProcessLogData {
    uuid: string
    instanceUuid: string
    isError: boolean
    summary: string
    resultTableName: string
    isReport?: boolean
    isProcessing: boolean
    lastRun: number
    logsList: IProcessInfoLogData[]
    // parametersList?: any
    parameters?: KeyValueData[]
    output: IReportOutputData
}

type ParameterData = {
    key: string
    value: any
}

export interface IProcessRequestData {
    recordId?: number
    recordUuid?: string
    processUuid?: string
    tableName: string
    id: number
    uuid: string
    isSummary?: boolean
    reportType: string
    tableSelectedId?: number
    reportViewUuid?: string
    parameters: KeyValueData[]
    selections: any[]
    printFormatUuid?: string
}

export interface IProcessListData {
    instanceUuid?: string
    userUuid?: string
    tableName?: string
    recordId?: number
    recordUuid?: string
    pageSize: number
    pageToken: string
}

export interface IProcessLogListData {
    recordCount: number
    processLogsList: IProcessLogData[]
    nextPageToken: string
}

// VUEX

// Process
export interface IProcessLogDataExtended extends IProcessLogData {
    parentUuid: string
    containerUuid: string
    processUuid?: string
    processId?: number
    processName?: string
    panelType: PanelContextType
    // parametersList: IPanelParameters[]
    logs: any[]
    output: IReportOutputData
    processIdPath?: string
}

export type INotificationProcessData = Partial<IPrintFormatChild> & Partial<IProcessLogDataExtended> & {
        menuParentUuid?: string | undefined
        message?: string
        option?: PrintFormatOptions
        selection?: any
        record?: any
        url?: string
        download?: string
    }
export interface ProcessState {
    inExecution: any[]
    isVisibleDialog: boolean
    reportObject: any
    reportList: INotificationProcessData[]
    metadata: Partial<IPanelDataExtended>
    process: INotificationProcessData[]
    sessionProcess: any[]
    notificationProcess: INotificationProcessData[]
    inRequestMetadata: any[]
    reportViewList: any[]
    totalResponse: number
    totalRequest: number
    totalSelection: number
    errorSelection: number
    successSelection: number
    reportFormat?: any
}
