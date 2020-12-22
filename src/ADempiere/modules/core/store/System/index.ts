import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { SystemState } from '@/ADempiere/modules/core'
import { IRootState } from '@/store'

const namespaced = true

export const systemModule: Module<SystemState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
