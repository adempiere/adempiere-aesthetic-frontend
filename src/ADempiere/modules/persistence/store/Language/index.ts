import { Module } from 'vuex'
import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'
import { state } from './state'
import { IRootState } from '@/store'
import { LanguageState } from '@/ADempiere/modules/persistence'

const namespaced = true

export const languageModule: Module<LanguageState, IRootState> = {
  namespaced,
  actions,
  getters,
  mutations,
  state
}
