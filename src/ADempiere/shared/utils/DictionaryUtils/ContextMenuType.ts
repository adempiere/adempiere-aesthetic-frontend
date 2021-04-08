import VueI18n from 'vue-i18n'

// Context Menu
export enum ActionContextType {
    Action = 'action',
    Process = 'process',
    Summary = 'summary',
    DataAction = 'dataAction',
    Application = 'application',
    Sequence = 'sequence',
    // Report
    UpdateReport = 'updateReport'
}

export enum ActionContextName {
    StartProcess = 'startProcess',
    ChangeParameters = 'changeParameters',
    Empty = '',
    SetDefaultValues = 'setDefaultValues',
    DeleteEntity = 'deleteEntity',
    UndoModifyData = 'undoModifyData',
    LockRecord = 'lockRecord',
    UnlockRecord = 'unlockRecord',
    OrderSequence = 'orderSequence',
    RecordAccess = 'recordAccess'
}

export enum PanelContextType {
    Window = 'window',
    Process = 'process',
    Browser = 'browser',
    Report = 'report',
    Table = 'table',
    Form = 'form',
    Custom = 'custom'
}

export enum ReportExportContextType {
    Html = 'html',
    Pdf = 'pdf'
}

export enum PrintFormatOptions {
    PrintFormat = 'printFormat',
    ReportView = 'reportView',
    DrillTable = 'drillTable'
}

export interface Actionable {
    type: ActionContextType
    name: VueI18n.TranslateResult
    action: ActionContextName
}

export type AssociatedContainer = {
    containerUuid?: string
    parentUuid?: string
    panelType?: PanelContextType
}

export type AssociatedTab = {
    tabUuid?: string
    tabName?: string
}
