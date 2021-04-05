import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { UtilsState } from './type'

const namespaced = true

export const utilsModule: Module<UtilsState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
