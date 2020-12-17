import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { WindowState } from '@/ADempiere/modules/persistence/PersistenceType'

const namespaced = true

export const windowModule: Module<WindowState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
