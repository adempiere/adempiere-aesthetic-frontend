import { Module } from 'vuex'
import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'
import { state } from './state'
import { RootState } from '@/ADempiere/shared/store/types'
import { PersistenceState } from '@/ADempiere/modules/persistence'

const namespaced = true

export const persistenceModule: Module<PersistenceState, RootState> = {
  namespaced,
  actions,
  getters,
  mutations,
  state
}
