import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { FieldValueState } from './type'

const namespaced = true

export const fieldValueModule: Module<FieldValueState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
