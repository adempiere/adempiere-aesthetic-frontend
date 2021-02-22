import { IRootState } from '@/store'
import { Module } from 'vuex'
import { ISettingsState } from '../SettingsType'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'

export const settings: Module<ISettingsState, IRootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}
