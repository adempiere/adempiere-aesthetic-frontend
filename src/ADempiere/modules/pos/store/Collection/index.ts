import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { CollectionState } from '../../POSType'

const namespaced = true

export const collectionModule: Module<CollectionState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
