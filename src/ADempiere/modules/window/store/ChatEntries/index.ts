import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { ChatEntriesState } from '@/ADempiere/modules/window/WindowType'

const namespaced = true

export const chatEntriesModule: Module<ChatEntriesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
