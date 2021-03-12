import { GetterTree } from 'vuex'
import { BusinessPartnerState } from '@/ADempiere/modules/core'
import { IRootState } from '@/store'
import { IBusinessPartnerData } from '../../CoreType'

type SystemGetter = GetterTree<BusinessPartnerState, IRootState>

export const getters: SystemGetter = {
  getBusinessPartner: (state: BusinessPartnerState) => {
    const bp = state
    if (!bp) {
      return {
        isLoaded: false,
        isReload: true,
        recordCount: 0,
        nextPageToken: undefined,
        isShowList: false, // popover with records list
        isShowCreate: false, // popover with create form
        businessPartnersList: []
      }
    }
    return bp
  },
  getBusinessPartnersList: (state: BusinessPartnerState): IBusinessPartnerData[] => {
    const list = state.businessPartnersList
    if (!list || !list.length) {
      return []
    }
    return list
  }
}
