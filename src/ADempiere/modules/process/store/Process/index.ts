import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { ProcessState } from '@/ADempiere/modules/process/ProcessType'

const namespaced = true

export const processModule: Module<ProcessState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
