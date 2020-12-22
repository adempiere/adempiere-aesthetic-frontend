import { Module } from 'vuex'
import { state, PreferenceState } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'

const namespaced = true

export const preferenceModule: Module<PreferenceState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
