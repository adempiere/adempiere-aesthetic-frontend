import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { FieldState } from '@/ADempiere/modules/dictionary'

const namespaced = true

export const fieldModule: Module<FieldState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
