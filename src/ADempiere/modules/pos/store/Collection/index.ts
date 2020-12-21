import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { CollectionState } from '../../POSType'

const namespaced = true

export const collectionModule: Module<CollectionState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
