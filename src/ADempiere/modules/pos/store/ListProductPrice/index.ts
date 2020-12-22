import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { ListProductPriceState } from '../../POSType'

const namespaced = true

export const listProductPriceModule: Module<ListProductPriceState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
