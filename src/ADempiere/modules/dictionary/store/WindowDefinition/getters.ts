import { GetterTree } from 'vuex'
import { IRootState } from '@/store'
import { WindowDefinitionState } from '@/ADempiere/modules/dictionary'
import { ITabData, ITabDataExtended, IWindowDataExtended } from '../../DictionaryType'
import store from '@/ADempiere/shared/store'

type WindowDefinitionGetterTree = GetterTree<WindowDefinitionState, IRootState>

export const getters: WindowDefinitionGetterTree = {
  getWindow: (state: WindowDefinitionState) => (
    windowUuid: string
  ): IWindowDataExtended | undefined => {
    return state.window.find(
      (item: IWindowDataExtended) => item.uuid === windowUuid
    )
  },
  getIsShowedRecordNavigation: () => (
    windowUuid: string
  ): boolean | undefined => {
    const window = store.getters.getwindow(windowUuid)
    if (window) {
      return window.isShowedRecordNavigation
    }
    return window
  },
  getPanelRight: (state: WindowDefinitionState) => {
    return state.panelRight
  },
  getTab: () => (
    windowUuid: string,
    tabUuid: string
  ): ITabDataExtended | undefined => {
    const window = <IWindowDataExtended | undefined>store.getters.getwindow(windowUuid)
    if (window) {
      return window.tabsList.find((tabItem: ITabDataExtended) => {
        return tabItem.uuid === tabUuid
      })
    }
    return window
  },
  getCurrentTab: () => (windowUuid: string) => {
    const window: IWindowDataExtended = store.getters.getwindow(windowUuid)
    if (window) {
      return window.tabsList.find((tabItem: ITabData) => {
        return tabItem.uuid === window.currentTabUuid
      })
    }
    return {
      isInsertRecord: false
    }
  },
  getTableNameFromTab: () => (
    windowUuid: string,
    tabUuid: string
  ): string => {
    const tab: ITabData = store.getters.getTab(windowUuid, tabUuid)
    return tab.tableName
  }
}
