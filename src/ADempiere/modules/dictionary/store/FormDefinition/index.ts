import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { FormDefinitionState } from '@/ADempiere/modules/dictionary'
import { RootState } from '@/ADempiere/shared/store/types'

const namespaced = true

export const formDefinitionModule: Module<FormDefinitionState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
