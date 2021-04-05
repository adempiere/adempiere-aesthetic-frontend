import { ContextMenuState } from '@/ADempiere/modules/window/WindowType/VuexType'

export const state : ContextMenuState = {
  contextMenu: [],
  listDocumentStatus: {
    defaultDocumentAction: undefined,
    documentActionsList: [],
    recordId: undefined,
    recordUuid: undefined
  },
  listDocumentAction: {
    defaultDocumentAction: undefined,
    documentActionsList: [],
    recordId: undefined,
    recordUuid: undefined
  }
}
