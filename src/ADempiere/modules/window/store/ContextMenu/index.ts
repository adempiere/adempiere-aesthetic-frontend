import { Module } from 'vuex'
import { actions } from './actions'
import { getters } from './getters'
import { state } from './state'
import { mutations } from './mutations'
import { IRootState } from '@/store'
import { ContextMenuState } from '@/ADempiere/modules/window/WindowType/VuexType'

const namespaced = true

export const contextMenuModule: Module<ContextMenuState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
