import { IDocumentStatusData } from '@/ADempiere/modules/core'
import {
  DrillTableAction,
  PrintFormatsAction,
  ProcessDefinitionAction,
  SummaryAction
} from '@/ADempiere/modules/dictionary/DictionaryType/ContextMenuType'
import { IResponseList } from '@/ADempiere/shared/utils/types'
import {
  WindowTabAssociatedAction,
  WindowProcessAsociatedAction,
  WindowDefinitionAction,
  RecordAccessAction
} from './ContextMenuType'
import {
  IChatEntryData,
  IDocumentActionData,
  IEntityLogData,
  IWorkflowProcessData
} from './DomainType'
import { IListEntityChatsResponse, IListWorkflowsResponse } from './ServiceType'

export type ReportableActions =
    | ProcessDefinitionAction
    | PrintFormatsAction
    | SummaryAction
    | DrillTableAction

export type IContextActionData =
    | WindowTabAssociatedAction
    | WindowProcessAsociatedAction
    | WindowDefinitionAction
    | RecordAccessAction
    | ReportableActions

export const cod: IContextActionData[] = []

export type IContextRelationData = any

export type IContextReferenceData = any

export interface IContextMenuData {
    containerUuid: string
    relations: IContextRelationData[]
    actions: IContextActionData[]
    references: IContextReferenceData[]
}

export interface IListDocumentStatus {
    defaultDocumentAction?: IDocumentStatusData
    documentActionsList: IDocumentActionData[]
    recordId?: number
    recordUuid?: string
}

export interface IListDocumentAction {
    defaultDocumentAction?: IDocumentActionData
    documentActionsList: IDocumentActionData[]
    recordId?: number
    recordUuid?: string
}

export interface ContextMenuState {
    isShowRightPanel: boolean
    isShowPopoverField: boolean
    isShowOptionField: boolean
    optionField: any
    contextMenu: IContextMenuData[]
    listDocumentStatus: IListDocumentStatus
    listDocumentAction: IListDocumentAction
    recordAccess: boolean
    embedded: Partial<IContextActionData>
}

// Chat Entries
export interface ChatEntriesState {
    listRecordChats: IListEntityChatsResponse
    listChatEntries: IChatEntryData[]
    chatText: string
    isNote: boolean
}

// Container Info
export interface ContainerInfoState {
    listworkflowLog: IResponseList<IWorkflowProcessData>
    listRecordLogs: {
        recordCount: number
        entityLogs: IEntityLogData[]
    }
    listWorkflows: IListWorkflowsResponse
}
