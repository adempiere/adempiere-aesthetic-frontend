import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { ChatEntriesState } from '@/ADempiere/modules/window/WindowType'

const namespaced = true

export const chatEntriesModule: Module<ChatEntriesState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
