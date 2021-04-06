import { MutationTree } from 'vuex'
import { ContextMenuState, IContextMenuData, IListDocumentAction, IListDocumentStatus } from '@/ADempiere/modules/window/WindowType/VuexType'
import { stat } from 'fs'

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
    state.listDocumentStatus = payload
  },
  changeShowRigthPanel(state: ContextMenuState) {
    state.isShowRightPanel = !state.isShowRightPanel
  },
  resetContextMenu(state: ContextMenuState) {
    state.isShowRightPanel = false
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
  }
}
