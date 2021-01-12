import { Module } from 'vuex'
import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'
import { state } from './state'
import { IRootState } from '@/store'
import { PersistenceState } from '@/ADempiere/modules/persistence'

const namespaced = true

export const persistenceModule: Module<PersistenceState, IRootState> = {
  namespaced,
  actions,
  getters,
  mutations,
  state
}
