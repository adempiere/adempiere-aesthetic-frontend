import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { LookupState } from '../../UITypes'

const namespaced = true

export const lookupModule: Module<LookupState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
