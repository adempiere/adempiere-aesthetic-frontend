import { MutationTree } from 'vuex'
import { IKeyLayoutDataExtended, KeyLayoutState } from '../../POSType'
import Vue from 'vue'

type KeyLayoutMutationTree = MutationTree<KeyLayoutState>

export const mutations: KeyLayoutMutationTree = {
  setKeyLayout(state: KeyLayoutState, keyLayout: IKeyLayoutDataExtended) {
    Vue.set(state, 'keyLayout', keyLayout)
  },
  setIsReloadKeyLayout(state: KeyLayoutState) {
    Vue.set(state.keyLayout, 'isReload', true)
    Vue.set(state.keyLayout, 'isLoaded', false)
  }
}
