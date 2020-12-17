import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { ContainerInfoState } from '../../WindowType'

const namespaced = true

export const containerInfoModule: Module<ContainerInfoState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
