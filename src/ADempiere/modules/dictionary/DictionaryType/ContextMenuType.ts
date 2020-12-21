import {
  Actionable,
  PanelContextType,
  PrintFormatOptions,
  ReportExportContextType
} from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IDrillTablesDataExtended, IReportViewDataExtended } from '../../report'
import { IPrintFormatDataExtended, IProcessDataExtended } from './VuexType'

// Process Definition
export interface ProcessDefinitionAction extends Actionable {
    processName: string
    uuid: string
    id: number
    description: string
    isReport: boolean
    isDirectPrint: boolean
    reportExportType?: ReportExportContextType
}

export interface SummaryAction extends ProcessDefinitionAction {
    childs: (ProcessDefinitionAction | IReportViewDataExtended)[]
    option?: PrintFormatOptions
}

export interface IPrintFormatChild extends ProcessDefinitionAction {
    printFormatUuid: string
}

export interface PrintFormatsAction extends ProcessDefinitionAction {
    option: PrintFormatOptions
    process: IProcessDataExtended
    childs: (IPrintFormatChild | Omit<IPrintFormatDataExtended, 'printFormatUuid'>)[]
}

export interface DrillTableAction extends ProcessDefinitionAction {
    option: PrintFormatOptions
    process: IProcessDataExtended
    childs: (IPrintFormatChild | IDrillTablesDataExtended)[]
}
// export interface ITabDataExtended extends ITabData {
//     parentUuid: string
//     containerUuid: string
//     windowUuid: string
//     tabGroup: IFieldGroupData
//     firstTabUuid: string
//     // relations
//     isParentTab: boolean
//     // app properties
//     isAssociatedTabSequence: boolean // show modal with order tab
//     isShowedRecordNavigation: boolean
//     isLoadFieldsList: boolean
//     index: number // this index is not related to the index in which the tabs are displayed
//     //tab source
//     tabAssociatedUuid?: string // tab source uuid
//     tabAssociatedName?: string // tab source name
// }
