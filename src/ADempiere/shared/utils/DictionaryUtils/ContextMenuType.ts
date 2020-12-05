import VueI18n from 'vue-i18n'

// Context Menu
export enum ActionContextType {
    Action = 'action',
    Process = 'process',
    Summary = 'summary',
    DataAction = 'dataAction',
    Application = 'application',
    Sequence = 'sequence'
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
    OrderSequence = 'orderSequence'
}

export enum PanelContextType {
    Window = 'window',
    Process = 'process',
    Browser = 'browser',
    Report = 'report'
}

export enum ReportExportContextType {
    Html = 'html'
}

export enum PrintFormatOptions {
    PrintFormat = 'printFormat'
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
