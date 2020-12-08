import { IFieldData, IFieldGroupData } from '@/ADempiere/modules/field'
import { ActionContextType, AssociatedTab, PanelContextType, PrintFormatOptions } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IPrintFormatData } from '@/ADempiere/modules/report'
import { IFormData, IProcessData, ITabData, IWindowData } from './DomainType'
import { WindowTabAssociatedAction } from '@/ADempiere/modules/window'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'

// Field State
export type IFieldDataExtended = IFieldData & {
    columnUuid?: string
    elementUuid?: string
    elementColumnName?: string
    tableName?: string
}

export interface FieldState {
    referenceList: any[]
    fieldsList: IFieldDataExtended[]
    validationRuleList: any[]
    fieldsListLocation: any[]
    isShowedLocation: boolean
}

// Form Definition State
export type IFormDataExtended = IFormData & {
    containerUuid: string
    fieldsList: any[]
    panelType: string
}

export interface FormDefinitionState {
    isShowedTitleForm: boolean
    form: IFormDataExtended[]
}

// Process Definition State

export interface IPrintFormatDataExtended extends IPrintFormatData {
    type: ActionContextType
    option: PrintFormatOptions
    instanceUuid?: string
    processUuid: string
    processId?: number
    printFormatUuid: string
}

// Process Definition State
export type IProcessDataExtended = IProcessData & {
    printFormatsAvailable: IPrintFormatDataExtended[]
}

export interface ProcessDefinitionState {
    process: IProcessData[]
}

// WindowDefinition
export interface ITabsSequenceData {
    uuid: string
    id: number
    parentUuid: string
    containerUuid: string
    parentTabUuid: string
    panelType: PanelContextType
    type: ActionContextType
    isSortTab: boolean
    name: string
    description: string
    tableName: string
    sortOrderColumnName: string
    sortYesNoColumnName: string
  }

export interface IPanelData extends ITabData {
        containerUuid: string
        isAdvancedQuery: boolean
        fieldLinkColumnName: string
        fieldsList: IFieldDataExtendedUtils[]
        panelType: PanelContextType
        // app attributes
        isLoadFieldsList: boolean
        isShowedTotals: boolean
        isTabsChildren: boolean
  }

export interface ITabDataExtended extends ITabData {
    containerUuid: string
    parentUuid: string
    windowUuid: string
    tabGroup: IFieldGroupData
    firstTabUuid: string
    // relations
    isParentTab: boolean
    // app properties
    isAssociatedTabSequence: boolean
    isShowedRecordNavigation: boolean
    isLoadFieldsList: false
    index: number
    associatedTab?: AssociatedTab
    tabsOrder?: WindowTabAssociatedAction[]
    tabParentIndex?: number
    tabChildrenIndex?: number
  }

export interface IWindowDataExtended extends IWindowData {
    tabsList: ITabData[]
    currentTab: ITabDataExtended
    tabsListParent: ITabDataExtended[]
    tabsListChildren: ITabDataExtended[]
    // app attributes
    currentTabUuid: string
    firstTab: ITabDataExtended
    firstTabUuid: string
    windowIndex: number
    // App properties
    isShowedTabsChildren: boolean
    isShowedRecordNavigation?: boolean
    isShowedAdvancedQuery: boolean
  }

export interface WindowDefinitionState {
    window: IWindowDataExtended[]
    windowIndex: number
    panelRight: string
}
