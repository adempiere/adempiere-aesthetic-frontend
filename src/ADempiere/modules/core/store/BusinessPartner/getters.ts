import { GetterTree } from 'vuex'
import { BusinessPartnerState } from '@/ADempiere/modules/core'
import { RootState } from '@/ADempiere/shared/store/types'

type SystemGetter = GetterTree<BusinessPartnerState, RootState>

export const getters: SystemGetter = {
  getBusinessPartner: (state: BusinessPartnerState) => {
    const bp = state
    if (state) {
      return {
        isLoaded: false,
        isReload: true,
        recordCount: 0,
        nextPageToken: undefined
      }
    }
    return bp
  },
  getBusinessPartnersList: (state: BusinessPartnerState) => {
    const list = state.businessPartnersList
    if (list) {
      return []
    }
    return list
  }
}
