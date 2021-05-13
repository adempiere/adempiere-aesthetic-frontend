import { Module } from 'vuex'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { IRootState } from '@/store'
import { ListProductPriceState } from '../../POSType'

const namespaced = true

export const productPriceModule: Module<ListProductPriceState, IRootState> = {
  namespaced,
  state,
  actions,
  mutations
}
