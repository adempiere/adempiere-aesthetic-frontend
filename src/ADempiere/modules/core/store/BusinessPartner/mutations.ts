import { BusinessPartnerState } from '@/ADempiere/modules/core'
import { MutationTree } from 'vuex'
import { ISystemInfoData } from '@/ADempiere/modules/user'
import { convertDateFormat } from '@/ADempiere/shared/utils/valueFormat'

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
