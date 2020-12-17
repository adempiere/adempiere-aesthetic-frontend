import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { EventState } from './type'

const namespaced = true

export const eventModule: Module<EventState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
