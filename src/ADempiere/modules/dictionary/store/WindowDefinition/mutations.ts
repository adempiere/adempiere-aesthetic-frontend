import { MutationTree } from 'vuex'
import {
  ITabDataExtended,
  IWindowDataExtended,
  WindowDefinitionState
} from '@/ADempiere/modules/dictionary/DictionaryType/VuexType'

type WindowDefinitionMutationTree = MutationTree<WindowDefinitionState>

export const mutations: WindowDefinitionMutationTree = {
  addWindow(state: WindowDefinitionState, payload: IWindowDataExtended) {
    state.window.push(payload)
    state.windowIndex++
  },
  dictionaryResetCacheWindow(state: WindowDefinitionState) {
    state = {
      window: [],
      panelRight: '',
      windowIndex: 0
    }
  },
  // Shouldn't be mutation
  setCurrentTab(
    state: WindowDefinitionState,
    payload: {
            tab: ITabDataExtended
        }
  ) {
    state.window[0].currentTab = payload.tab
    state.window[0].currentTabUuid = payload.tab.uuid
    // payload.window.currentTab = payload.tab
    // payload.window.currentTabUuid = payload.tab.uuid
  },
  changeWindowAttribute(state: WindowDefinitionState, payload) {
    let value = payload.attributeValue
    if (payload.attributeNameControl) {
      value = payload.window[payload.attributeNameControl]
    }
    payload.window[payload.attributeName] = value
  },
  changeTabAttribute(state, payload) {
    let value = payload.attributeValue
    if (payload.attributeNameControl) {
      value = payload.tab[payload.attributeNameControl]
    }
    payload.tab[payload.attributeName] = value
  },
  setPanelRight(state, payload) {
    state.panelRight = payload
  }
}
