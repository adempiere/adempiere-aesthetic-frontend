import { Module } from 'vuex'
import { state, PreferenceState } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'

const namespaced = true

export const preferenceModule: Module<PreferenceState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
