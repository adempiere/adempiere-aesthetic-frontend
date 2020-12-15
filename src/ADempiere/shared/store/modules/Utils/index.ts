import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { UtilsState } from './type'

const namespaced = true

export const utilsModule: Module<UtilsState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
