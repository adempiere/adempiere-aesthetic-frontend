import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { SystemState } from '@/ADempiere/modules/core'
import { RootState } from '@/ADempiere/shared/store/types'

const namespaced = true

export const systemModule: Module<SystemState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
