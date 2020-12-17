import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { FieldValueState } from './type'

const namespaced = true

export const fieldValueModule: Module<FieldValueState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
