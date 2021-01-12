import { GetterTree } from 'vuex'
import { BusinessPartnerState } from '@/ADempiere/modules/core'
import { IRootState } from '@/store'
import { IBusinessPartnerData } from '../../CoreType'

type SystemGetter = GetterTree<BusinessPartnerState, IRootState>

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
  getBusinessPartnersList: (state: BusinessPartnerState): IBusinessPartnerData[] => {
    const list = state.businessPartnersList
    if (list) {
      return []
    }
    return list
  }
}
