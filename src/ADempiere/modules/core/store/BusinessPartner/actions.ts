import {
  BusinessPartnerState,
  requestListBusinessPartner
} from '@/ADempiere/modules/core'
import { IRootState } from '@/store'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { extractPagingToken } from '@/ADempiere/shared/utils/valueUtils'
import { ActionContext, ActionTree } from 'vuex'
import { IListBusinessPartnerResponse } from '../../CoreType'

type BPartnerActionContext = ActionContext<BusinessPartnerState, IRootState>
type BPartnerActionTree = ActionTree<BusinessPartnerState, IRootState>

export const actions: BPartnerActionTree = {
  listBPartnerFromServer(
    context: BPartnerActionContext,
    payload: {
            searchValue: string
            value?: string
            name?: string
            contactName?: string
            eMail?: string
            postalCode?: string
            phone?: string
            // Query
            criteria?: number
            pageNumber: number
        }
  ) {
    let pageToken: string, token: string
    if (!payload.pageNumber) {
      if (context.state.pageNumber) {
        payload.pageNumber = context.state.pageNumber
      } else {
        payload.pageNumber = 1
      }
    }

    if (context.state.token) {
      token = context.state.token
      pageToken = token + '-' + payload.pageNumber
    } else {
      token = ''
      pageToken = ''
    }

    return requestListBusinessPartner({
      ...payload,
      pageToken: pageToken,
      pageSize: payload.criteria!
    })
      .then((responseBPartnerList: IListBusinessPartnerResponse) => {
        if (!token || !pageToken) {
          token = extractPagingToken(
            responseBPartnerList.nextPageToken
          )
        }

        context.commit('setBusinessPartnersList', {
          ...responseBPartnerList,
          isLoaded: true,
          isReload: false,
          token,
          pageNumber: payload.pageNumber
        })

        return responseBPartnerList.list
      })
      .catch(error => {
        console.warn(error)
        showMessage({
          type: 'info',
          message: error.message
        })
      })
  },
  setBPartnerPageNumber(context: BPartnerActionContext, pageNumber: number) {
    context.commit('setBPartnerPageNumber', pageNumber)
    context.dispatch('listBPartnerFromServer', {
      // posUuid: getters.getPointOfSalesUuid
    })
  }
}
