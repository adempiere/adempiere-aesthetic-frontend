import { Module } from 'vuex'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { OrderLinesState } from '../../POSType'

const namespaced = true

export const orderLinesModule: Module<OrderLinesState, IRootState> = {
  namespaced,
  state,
  actions,
  mutations
}
