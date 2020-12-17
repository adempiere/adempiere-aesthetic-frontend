import {
  Actionable,
  PanelContextType,
  AssociatedContainer,
  AssociatedTab
} from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'

// Window Definition
export interface WindowDefinitionAction extends Actionable {
    processName: string
    disabled: boolean
    parentUuid?: string
    //
    hidden?: boolean
    tableName?: string
    recordId?: number | null
}

export interface WindowProcessAsociatedAction extends Actionable {
    id: number
    uuid: string
    panelType: PanelContextType
    description: string
    help: string
    isReport: boolean
    isDirectPrint: boolean
    associated: AssociatedContainer
}

export interface WindowTabAssociatedAction extends Actionable {
    uuid: string
    id: number
    isSortTab: boolean
    name: string
    description: string
    tableName: string
    parentTabUuid: string
    sortOrderColumnName: string // order column
    sortYesNoColumnName: string // included column
    parentUuid: string
    containerUuid: string
    panelType: PanelContextType
    processName: string
    associatedTab: AssociatedTab
}
