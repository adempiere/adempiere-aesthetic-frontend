import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { DashboardState } from '@/ADempiere/modules/dashboard'

const namespaced = true

export const dashboardModule: Module<DashboardState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
