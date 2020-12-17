import { MutationTree } from 'vuex'
import { ContextMenuState, IContextMenuData, IListDocumentAction, IListDocumentStatus } from '@/ADempiere/modules/window/WindowType/VuexType'

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
  resetContextMenu(state: ContextMenuState) {
    state = {
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
  }
}
