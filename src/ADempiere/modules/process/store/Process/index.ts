import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { ProcessState } from '@/ADempiere/modules/process/ProcessType'

const namespaced = true

export const processModule: Module<ProcessState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
