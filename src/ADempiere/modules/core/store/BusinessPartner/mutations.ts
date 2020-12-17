import { BusinessPartnerState } from '@/ADempiere/modules/core'
import { MutationTree } from 'vuex'

type BusinessPartnerMutationTree = MutationTree<BusinessPartnerState>

export const mutations: BusinessPartnerMutationTree = {
  setBusinessPartnersList(
    state: BusinessPartnerState,
    payload: BusinessPartnerState
  ) {
    state = {
      ...state,
      ...payload
    }
  },
  setBPartnerPageNumber(state: BusinessPartnerState, pageNumber: number) {
    state.pageNumber = pageNumber
  }
}
