import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { LookupState } from '../../UITypes'

const namespaced = true

export const lookupModule: Module<LookupState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
