import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { BusinessDataState } from '../PersistenceType'

const namespaced = true

export const businessDataModule: Module<BusinessDataState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
