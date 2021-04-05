import { IContextInfoData } from '@/ADempiere/modules/core'
import { IFieldData, IFieldGroupData } from '@/ADempiere/modules/field'

export interface IReportExportTypeData {
    name: string
    description: string
    type: string
    reportExportType?: string
}

export interface IProcessData {
    processName?: string
    accessLevel: number
    description: string
    help: string
    id: number
    isActive: boolean
    isDirectPrint: boolean
    isReport: boolean
    name: string
    parameters: IFieldData[]
    reportExportTypes: IReportExportTypeData[] // no convert content
    showHelp: string
    uuid: string
}

export type ITabDataReduced = {
    uuid: string
    id: number
    isSortTab: boolean
    name: string
    description: string
    tableName: string
    parentTabUuid: string
    sortOrderColumnName: string // order column
    sortYesNoColumnName: string // included column
}

export interface ITabData extends ITabDataReduced {
    help: string
    sequence: number
    tabLevel: number
    isActive: boolean
    isSingleRow: boolean
    isAdvancedTab: boolean
    isHasTree: boolean
    isInfoTab: boolean
    isTranslationTab: boolean
    isReadOnly: boolean
    isInsertRecord: boolean
    isView: boolean
    isDeleteable: boolean
    isDocument: boolean
    isChangeLog: boolean
    accessLevel: number
    linkColumnName: string
    parentColumnName: string
    displayLogic: string
    commitWarning: string
    query: string
    whereClause: string
    orderByClause: string
    contextInfo: IContextInfoData
    fieldGroup: IFieldGroupData
    processes: IProcessData[]
    fields: IFieldData[]
}

export interface IWindowData {
    id: number
    uuid: string
    name: string
    description: string
    help: string
    isActive: boolean
    isSalesTransaction: boolean
    windowType: string
    contextInfo: IContextInfoData
    tabs: ITabData[]
}

export interface IBrowserData {
    id: number
    uuid: string
    viewUuid: string
    //
    value: string
    name: string
    description: string
    help: string
    accessLevel: number
    isActive: boolean
    //
    isUpdateable: boolean
    isDeleteable: boolean
    isSelectedByDefault: boolean
    isCollapsibleByDefault: boolean
    isExecutedQueryByDefault: boolean
    isShowTotal: boolean
    // search query
    query: string
    whereClause: string
    orderByClause: string
    // External Reference
    window: IWindowData
    process: IProcessData
    //
    fields: IFieldData[]
}

export interface IFormData {
    id: number
    uuid: string
    name: string
    description: string
    help: string
    accessLevel: number
    fileName: string
    isActive: boolean
}

export interface IValidationRule {
    id: number
    uuid: string
    name: string
    description: string
    validationCode: string
    type: string
}
