import { IRootState } from '@/store'
import { Module } from 'vuex'
import { IUserState } from '../UserType'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'

export const user: Module<IUserState, IRootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
