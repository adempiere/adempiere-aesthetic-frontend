import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { BusinessDataState } from '../PersistenceType'

const namespaced = true

export const businessDataModule: Module<BusinessDataState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
