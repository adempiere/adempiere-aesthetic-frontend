import { Module } from 'vuex'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { KeyLayoutState } from '../../POSType'

const namespaced = true

export const keyLayoutModule: Module<KeyLayoutState, IRootState> = {
  namespaced,
  state,
  actions,
  mutations
}
