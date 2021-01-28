import { ActionContext, GetterTree } from 'vuex'
import { IRootState } from '@/store'
import { WindowDefinitionState } from '@/ADempiere/modules/dictionary'
import { ITabData, ITabDataExtended, IWindowDataExtended } from '../../DictionaryType'

type WindowDefinitionGetterTree = GetterTree<WindowDefinitionState, IRootState>

export const getters: WindowDefinitionGetterTree = {
  getWindow: (state: WindowDefinitionState) => (
    windowUuid: string
  ): IWindowDataExtended | undefined => {
    return state.window.find(
      (item: IWindowDataExtended) => (item.uuid === windowUuid)
    )
  },
  getIsShowedRecordNavigation: (state, getters) => (
    windowUuid: string
  ): boolean | undefined => {
    const window = getters.getWindow(windowUuid)
    if (window) {
      return window.isShowedRecordNavigation
    }
    return window
  },
  getPanelRight: (state: WindowDefinitionState) => {
    return state.panelRight
  },
  getTab: (state: WindowDefinitionState, getters) => (
    windowUuid: string,
    tabUuid: string
  ): ITabDataExtended | undefined => {
    const window = <IWindowDataExtended | undefined>getters.getWindow(windowUuid)
    if (window) {
      return window.tabsList.find((tabItem: ITabDataExtended) => {
        return tabItem.uuid === tabUuid
      })
    }
    return window
  },
  getCurrentTab: (state, getters) => (windowUuid: string) => {
    const window: IWindowDataExtended = getters.getWindow(windowUuid)
    if (window) {
      return window.tabsList.find((tabItem: ITabData) => {
        return tabItem.uuid === window.currentTabUuid
      })
    }
    return {
      isInsertRecord: false
    }
  },
  getTableNameFromTab: (state, getters) => (
    windowUuid: string,
    tabUuid: string
  ): string => {
    const tab: ITabData = getters.getTab(windowUuid, tabUuid)
    return tab.tableName
  }
}
