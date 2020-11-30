import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { FieldState } from '@/ADempiere/modules/dictionary'

const namespaced = true

export const fieldModule: Module<FieldState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
