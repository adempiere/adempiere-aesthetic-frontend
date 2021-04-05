import { BusinessPartnerState } from '@/ADempiere/modules/core'
import { stat } from 'fs'
import { MutationTree } from 'vuex'

type BusinessPartnerMutationTree = MutationTree<BusinessPartnerState>

export const mutations: BusinessPartnerMutationTree = {
  setBusinessPartnersList(
    state: BusinessPartnerState,
    payload: Partial<BusinessPartnerState>
  ) {
    state.businessPartnersList = payload.businessPartnersList || state.businessPartnersList
    state.isLoaded = payload.isLoaded || state.isLoaded
    state.isReload = payload.isReload || state.isReload
    state.isShowCreate = payload.isShowCreate || state.isShowCreate
    state.isShowList = payload.isShowList || state.isShowList
    state.nextPageToken = payload.nextPageToken || state.nextPageToken
    state.pageNumber = payload.pageNumber || state.pageNumber
    state.recordCount = payload.recordCount || state.recordCount
    state.token = payload.token || state.token
  },
  setBPartnerPageNumber(state: BusinessPartnerState, pageNumber: number) {
    state.pageNumber = pageNumber
  }
}
