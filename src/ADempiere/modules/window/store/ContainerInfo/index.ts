import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { ContainerInfoState } from '../../WindowType'

const namespaced = true

export const containerInfoModule: Module<ContainerInfoState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
