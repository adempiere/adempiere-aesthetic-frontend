import { IRootState } from '@/store'
import { ActionContext, GetterTree } from 'vuex'
import {
  ContextMenuState,
  IContextActionData,
  IContextMenuData,
  IListDocumentAction,
  IListDocumentStatus
} from '@/ADempiere/modules/window/WindowType/VuexType'
import { recursiveTreeSearch } from '@/ADempiere/shared/utils/valueUtils'
import { RouteConfig } from 'vue-router'

type ContextMenuGetterTree = GetterTree<ContextMenuState, IRootState>
type ContextMenuActionContext = ActionContext<ContextMenuState, IRootState>

export const getters: ContextMenuGetterTree = {
  getContextMenu: (state: ContextMenuState) => (containerUuid: string): IContextMenuData | undefined => {
    return state.contextMenu.find(
      (item: IContextMenuData) => item.containerUuid === containerUuid
    )
  },
  getRelations: (
    state: ContextMenuState,
    context: ContextMenuActionContext
  ) => (containerUuid: string, permissionRoutes: RouteConfig[]) => {
    const dataTree = permissionRoutes
    return recursiveTreeSearch({
      treeData: dataTree,
      attributeName: 'name',
      attributeValue: containerUuid,
      attributeChilds: 'children'
    })
  },
  getActions: (state: ContextMenuState) => (
    containerUuid: string
  ): IContextActionData[] | undefined => {
    const menu: IContextMenuData | undefined = state.contextMenu.find(
      item => item.containerUuid === containerUuid
    )

    if (menu) {
      return menu.actions
    }
    return menu
  },
  getListDocumentActions: (state: ContextMenuState): IListDocumentAction => {
    return state.listDocumentAction
  },
  getListDocumentStatus: (state: ContextMenuState): IListDocumentStatus => {
    return state.listDocumentStatus
  },
  getListDocumentActionByUuid: (state: ContextMenuState) => (
    recordUuid: string
  ): IListDocumentAction | undefined => {
    if (state.listDocumentAction.recordUuid === recordUuid) {
      return state.listDocumentAction
    } else {
      return undefined
    }
  }
}
