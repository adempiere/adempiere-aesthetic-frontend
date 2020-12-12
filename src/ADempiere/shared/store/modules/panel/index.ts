import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { PanelState } from './type'

const namespaced = true

export const panelModule: Module<PanelState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
