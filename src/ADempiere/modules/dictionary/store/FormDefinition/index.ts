import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { FormDefinitionState } from '@/ADempiere/modules/dictionary'
import { IRootState } from '@/store'

const namespaced = true

export const formDefinitionModule: Module<FormDefinitionState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
