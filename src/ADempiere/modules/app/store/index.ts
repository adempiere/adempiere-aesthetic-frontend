import { IRootState } from '@/store'
import { Module } from 'vuex'
import { IAppState } from '../AppType'
import { state } from './state'
import { actions } from './actions'
import { mutations } from './mutations'

const namespaced = true

export const app: Module<IAppState, IRootState> = {
  namespaced,
  state,
  actions,
  mutations
}
