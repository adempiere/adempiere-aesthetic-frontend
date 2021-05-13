import { ContextMenuState } from '@/ADempiere/modules/window/WindowType/VuexType'

export const state : ContextMenuState = {
  isShowRightPanel: false,
  isShowPopoverField: false,
  optionField: {},
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
  },
  recordAccess: false
}
