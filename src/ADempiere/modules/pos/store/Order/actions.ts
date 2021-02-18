import { IRootState } from '@/store'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { extractPagingToken } from '@/ADempiere/shared/utils/valueUtils'
import { ActionContext, ActionTree } from 'vuex'
import { requestGetOrder, requestListOrders } from '../../POSService'
import { IListOrdersResponse, IOrderData, OrderState } from '../../POSType'

type OrderActionContext = ActionContext<OrderState, IRootState>
type OrderActionTree = ActionTree<OrderState, IRootState>

export const actions: OrderActionTree = {
  /**
     * Set page number of pagination list
     * @param {number}  pageNumber
     */
  setOrdersListPageNumber(context: OrderActionContext, pageNumber: number) {
    context.commit('setOrdersListPageNumber', pageNumber)
    context.dispatch('listOrdersFromServer', {})
  },
  listOrdersFromServer(context: OrderActionContext, payload: {
        posUuid: string
        documentNo: number
        businessPartnerUuid: string
        grandTotal: number
        openAmount: number
        isPaid: boolean
        isProcessed: boolean
        isAisleSeller: boolean
        isInvoiced: boolean
        dateOrderedFrom: any
        dateOrderedTo: any
        salesRepresentativeUuid: string
      }) {
    const { documentNo, businessPartnerUuid, grandTotal, openAmount, isPaid, isProcessed, isAisleSeller, isInvoiced, dateOrderedFrom, dateOrderedTo, salesRepresentativeUuid } = payload
    let { posUuid } = payload
    if (!posUuid) {
      posUuid = context.getters.getPointOfSalesUuid()
    }

    let { pageNumber, nextPageToken } = context.state.listOrder
    if (!pageNumber) {
      pageNumber = 1
    }
    let pageToken = ''
    if (!nextPageToken) {
      pageToken = nextPageToken + '-' + pageNumber
    }

    requestListOrders({
      posUuid,
      documentNo: documentNo.toString(),
      businessPartnerUuid,
      grandTotal,
      openAmount,
      isPaid,
      isProcessed,
      isAisleSeller,
      isInvoiced,
      dateOrderedFrom,
      dateOrderedTo,
      salesRepresentativeUuid,
      pageToken
    })
      .then((responseOrdersList: IListOrdersResponse) => {
        if (!nextPageToken || !pageToken) {
          nextPageToken = extractPagingToken(responseOrdersList.nextPageToken)
        }

        context.commit('setListOrder', {
          ...responseOrdersList,
          isLoaded: true,
          isReload: false,
          posUuid,
          nextPageToken,
          pageNumber
        })
      })
      .catch(error => {
        console.warn(`listOrdersFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'info',
          message: error.message,
          showClose: true
        })
      })
  },
  setOrder(context: OrderActionContext, order: IOrderData) {
    context.commit('setOrder', order)
  },
  currentOrder(context: OrderActionContext, findOrder: IOrderData) {
    context.commit('findOrder', findOrder)
  },
  findOrderServer(context: OrderActionContext, orderUuid: string) {
    if (typeof orderUuid === 'string' && (orderUuid)) {
      requestGetOrder(orderUuid)
        .then((responseOrder: IOrderData) => {
          context.commit('findOrder', responseOrder)
        })
        .catch(error => {
          console.warn(`findOrderServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'info',
            message: error.message,
            showClose: true
          })
        })
    }
    context.commit('findOrder', {})
  }
}
