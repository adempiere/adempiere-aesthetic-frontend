import { IDocumentStatusData } from '@/ADempiere/modules/core'
import {
  PrintFormatsAction,
  ProcessDefinitionAction,
  SummaryAction
} from '@/ADempiere/modules/dictionary/DictionaryType/ContextMenuType'
import {
  WindowTabAssociatedAction,
  WindowProcessAsociatedAction,
  WindowDefinitionAction
} from './ContextMenuType'
import { IDocumentActionData } from './DomainType'

export type IContextActionData =
    | WindowTabAssociatedAction
    | WindowProcessAsociatedAction
    | WindowDefinitionAction
    | ProcessDefinitionAction
    | PrintFormatsAction
    | SummaryAction

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
    contextMenu: IContextMenuData[]
    listDocumentStatus: IListDocumentStatus
    listDocumentAction: IListDocumentAction
}
