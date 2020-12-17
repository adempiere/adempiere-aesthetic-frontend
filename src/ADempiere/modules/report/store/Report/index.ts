import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { ReportState } from '../../ReportType'

const namespaced = true

export const reportModule: Module<ReportState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
