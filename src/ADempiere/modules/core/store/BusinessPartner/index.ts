import { Module } from 'vuex'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { BusinessPartnerState } from '@/ADempiere/modules/core'
import { RootState } from '@/ADempiere/shared/store/types'

const namespaced = true

export const businessPartnerModule: Module<BusinessPartnerState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
