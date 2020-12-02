import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { ProcessDefinitionState } from '@/ADempiere/modules/dictionary'

const namespaced = true

export const processDefinitionModule: Module<ProcessDefinitionState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
