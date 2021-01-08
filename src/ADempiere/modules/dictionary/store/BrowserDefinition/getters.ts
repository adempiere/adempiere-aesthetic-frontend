import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { BrowserDefinitionState, IBrowserDataExtended } from '../../DictionaryType'

type BrowserDefinitionGetterTree = GetterTree<BrowserDefinitionState, IRootState>

export const getters: BrowserDefinitionGetterTree = {
  getBrowser: (state: BrowserDefinitionState) => (browserUuid: string): IBrowserDataExtended | undefined => {
    return state.browser.find(
      (item: IBrowserDataExtended) => item.uuid === browserUuid
    )
  }
}
