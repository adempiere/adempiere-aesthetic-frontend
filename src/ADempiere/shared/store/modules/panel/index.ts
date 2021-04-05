import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { PanelState } from './type'

const namespaced = true

export const panelModule: Module<PanelState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
