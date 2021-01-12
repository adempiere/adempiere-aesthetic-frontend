import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { ReportState } from '../../ReportType'

const namespaced = true

export const reportModule: Module<ReportState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
