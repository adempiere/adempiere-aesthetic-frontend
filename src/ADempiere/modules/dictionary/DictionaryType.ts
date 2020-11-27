import { IFieldData, IFieldGroupData } from '@/ADempiere/modules/field'
import { IContextInfoData } from '@/ADempiere/modules/core'

export interface IReportExportTypeData {
    name: string
    description: string
    type: string
}

export interface IProcessData {
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

export interface ITabData {
    id: number
    uuid: string
    name: string
    description: string
    help: string
    tableName: string
    sequence: number
    tabLevel: number
    isActive: boolean
    isSingleRow: boolean
    isAdvancedTab: boolean
    isHasTree: boolean
    isInfoTab: boolean
    isSortTab: boolean
    isTranslationTab: boolean
    isReadOnly: boolean
    isInsertRecord: boolean
    isView: boolean
    isDeleteable: boolean
    isDocument: boolean
    isChangeLog: boolean
    accessLevel: number
    linkColumnName: string
    sortOrderColumnName: string
    sortYesNoColumnName: string
    parentColumnName: string
    displayLogic: string
    commitWarning: string
    query: string
    whereClause: string
    orderByClause: string
    parentTabUuid: string
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

// Request API Services
export interface IDictionaryRequest {
    uuid: string
    id: number
}

export interface IDictionaryFieldRequest {
    uuid: string
    columnUuid?: string
    elementUuid?: string
    fieldUuid: string
    // TableName + ColumnName
    tableName?: string
    columnName?: string
    elementColumnName?: string
}

export type IFieldDataExtended = IFieldData & {
    columnUuid?: string
    elementUuid?: string
    elementColumnName?: string
    tableName?: string
}

export interface FieldState {
    referenceList: []
    fieldsList: IFieldDataExtended[]
    validationRuleList: []
    fieldsListLocation: []
    isShowedLocation: boolean
}
