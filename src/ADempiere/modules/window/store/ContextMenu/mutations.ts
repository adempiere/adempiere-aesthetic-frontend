import { MutationTree } from 'vuex'
import { ContextMenuState, IContextActionData, IContextMenuData, IListDocumentAction, IListDocumentStatus } from '@/ADempiere/modules/window/WindowType/VuexType'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'

type ContextMenuMutationTree = MutationTree<ContextMenuState>

export const mutations: ContextMenuMutationTree = {
  setContextMenu(state: ContextMenuState, payload: IContextMenuData) {
    state.contextMenu.push(payload)
  },
  dictionaryResetCacheContextMenu(state: ContextMenuState) {
    state.contextMenu = []
  },
  listDocumentAction(state: ContextMenuState, payload: IListDocumentAction) {
    state.listDocumentAction = payload
  },
  addlistDocumentStatus(
    state: ContextMenuState,
    payload: IListDocumentStatus
  ) {
    state.listDocumentStatus.documentActionsList = payload.documentActionsList
    state.listDocumentStatus.recordId = payload.recordId
    state.listDocumentStatus.defaultDocumentAction = payload.defaultDocumentAction
    state.listDocumentStatus.recordUuid = payload.recordUuid
  },
  changeShowRigthPanel(state: ContextMenuState, params: boolean) {
    if (isEmptyValue(params)) {
      state.isShowRightPanel = !state.isShowRightPanel
    }
    state.isShowRightPanel = params
  },
  changeShowOptionField(state: ContextMenuState, isShowOptionField: boolean) {
    state.isShowOptionField = isShowOptionField
  },
  changeShowPopoverField(state: ContextMenuState) {
    state.isShowPopoverField = !state.isShowPopoverField
  },
  resetContextMenu(state: ContextMenuState) {
    state.isShowRightPanel = false
    state.isShowPopoverField = false
    state.optionField = {}
    state.contextMenu = []
    state.listDocumentStatus = {
      defaultDocumentAction: undefined,
      documentActionsList: [],
      recordId: undefined,
      recordUuid: undefined
    }
    state.listDocumentAction = {
      defaultDocumentAction: undefined,
      documentActionsList: [],
      recordId: undefined,
      recordUuid: undefined
    }
    state.recordAccess = false
    state.embedded = {
      name: ''
    }
  },
  fieldContextMenu(state: ContextMenuState, payload) {
    state.optionField = payload
  },
  setRecordAccess(state: ContextMenuState, recordAccess: boolean) {
    state.recordAccess = recordAccess
  },
  attributeEmbedded(state: ContextMenuState, params: IContextActionData) {
    state.embedded = params
  }
}
