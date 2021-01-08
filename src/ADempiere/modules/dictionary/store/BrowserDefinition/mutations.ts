import { MutationTree } from 'vuex'
import {
  BrowserDefinitionState,
  IBrowserDataExtended
} from '../../DictionaryType'

type BrowserDefinitionMutationTree = MutationTree<BrowserDefinitionState>

export const mutations: BrowserDefinitionMutationTree = {
  addBrowser(state: BrowserDefinitionState, payload: IBrowserDataExtended) {
    state.browser.push(payload)
  },
  dictionaryResetCacheBrowser(state: BrowserDefinitionState) {
    state.browser = []
  },
  changeBrowserAttribute(state: BrowserDefinitionState, payload): void {
    let value = payload.attributeValue
    if (payload.attributeNameControl) {
      value = payload.browser[payload.attributeNameControl]
    }
    payload.browser[payload.attributeName] = value
  }
}
