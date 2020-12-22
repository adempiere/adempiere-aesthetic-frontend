import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { WindowState } from '@/ADempiere/modules/persistence/PersistenceType'

const namespaced = true

export const windowModule: Module<WindowState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
