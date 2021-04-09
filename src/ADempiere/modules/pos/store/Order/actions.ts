import { IRootState } from '@/store'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { extractPagingToken, isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { ActionContext, ActionTree } from 'vuex'
import { requestCreateOrder, requestCreateOrderLine, requestGetOrder, requestListOrders, requestUpdateOrder } from '../../POSService'
import { IListOrdersResponse, IOrderData, OrderState } from '../../POSType'
import { Namespaces } from '@/ADempiere/shared/utils/types'

type OrderActionContext = ActionContext<OrderState, IRootState>
type OrderActionTree = ActionTree<OrderState, IRootState>

/**
   * Create Sales Order
   * @param {string} posUuid Current POS Uuid
   * @param {string} customerUuid Customer Uuid
   * @param {string} salesRepresentativeUuid Sales Representative Uuid
   */
export const actions: OrderActionTree = {
  createOrder(context: OrderActionContext, payload: {
    posUuid: string
    customerUuid: string
    salesRepresentativeUuid: string
  }) {
    const { posUuid, customerUuid, salesRepresentativeUuid } = payload
    return requestCreateOrder({
      posUuid,
      customerUuid,
      salesRepresentativeUuid
    })
      .then((order: IOrderData) => {
        context.commit('setOrder', order)
        context.dispatch('fillOrder', { attribute: order })
        context.commit('setIsReloadListOrders')
        return order
      })
      .catch(error => {
        console.log(error.message)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  /**
   * Update Sales Order
   * @param {string} posUuid Current POS Uuid
   * @param {string} posUuid Order Uuid
   * @param {string} customerUuid Customer Uuid
   */
  updateOrder(context: OrderActionContext, payload: {
    orderUuid: string
    posUuid: string
    customerUuid: string
  }): void {
    const { orderUuid, posUuid, customerUuid } = payload
    requestUpdateOrder({
      orderUuid,
      posUuid,
      customerUuid
    })
      .then((response: IOrderData) => {
        context.dispatch('reloadOrder', { orderUuid: response.uuid })
      })
      .catch(error => {
        console.error(error.message)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  /**
   * Create order line from order uuid and product
   * @param {string} orderUuid Order Uuid
   * @param {string} productUuid Product Uuid
   * @param {string} description Product description
   * @param {number} quantity Quantity Producto
   * @param {number} price Price Producto
   * @param {number} discountRate DiscountRate Producto
   */
  createOrderLine(context: OrderActionContext, payload: {
    orderUuid: string
    warehouseUuid?: string
    productUuid: string
    chargeUuid?: string
    description?: string
    quantity?: number
    price?: number
    discountRate?: number
  }) {
    const { orderUuid, productUuid } = payload
    requestCreateOrderLine({
      orderUuid,
      productUuid
    })
      .then(orderLine => {
        context.dispatch(Namespaces.OrderLines + '/' + 'updateOrderLines', orderLine, {
          root: true
        })
        // this.fillOrderLine(orderLine)
        context.dispatch('reloadOrder', orderUuid)
      })
      .catch(error => {
        console.warn(error.message)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  /**
   * Reload Order
   * @param {string} orderUuid Order Uuid
   */
  reloadOrder(context: OrderActionContext, payload: { orderUuid: string }) {
    let { orderUuid } = payload
    if (isEmptyValue(orderUuid)) {
      orderUuid = context.rootGetters.getOrder.uuid // this.currentOrder.uuid
    }
    if (!isEmptyValue(orderUuid)) {
      requestGetOrder(orderUuid)
        .then((orderResponse: IOrderData) => {
          context.dispatch('fillOrder', {
            attribute: orderResponse,
            setToStore: false
          })
          context.dispatch('currentOrder', orderResponse)
        // dispatch('listOrderLinesFromServer', orderResponse.uuid)
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    }
  },
  /**
   * Fill Order
   * @param {object} attribute Attributes of the Order
   * @param {boolean} setToStore set To Store
   */
  fillOrder(context: OrderActionContext, payload: {
    attribute: IOrderData
    setToStore?: boolean
  }) {
    const {
      attribute,
      setToStore = payload.setToStore || true
    } = payload
    const orderToPush: IOrderData = {
      ...attribute
    }
    // if (setToStore) {
    context.dispatch('setOrder', {
      ...orderToPush
    })
    // }
  },
  /**
     * Set page number of pagination list
     * @param {number}  pageNumber
     */
  setOrdersListPageNumber(context: OrderActionContext, pageNumber: number) {
    context.commit('setOrdersListPageNumber', pageNumber)
    context.dispatch('listOrdersFromServer', {})
  },
  listOrdersFromServer(context: OrderActionContext, payload: {
        posUuid?: string
        documentNo?: number
        businessPartnerUuid?: string
        grandTotal: number
        openAmount?: number
        isPaid?: boolean
        isProcessed?: boolean
        isAisleSeller?: boolean
        isInvoiced?: boolean
        dateOrderedFrom?: any
        dateOrderedTo?: any
        salesRepresentativeUuid?: string
      }) {
    const { documentNo, businessPartnerUuid, grandTotal, openAmount, isPaid, isProcessed, isAisleSeller, isInvoiced, dateOrderedFrom, dateOrderedTo, salesRepresentativeUuid } = payload
    let { posUuid = payload.posUuid || undefined } = payload
    if (isEmptyValue(posUuid)) {
      posUuid = context.rootGetters[Namespaces.PointOfSales + '/' + 'getPointOfSalesUuid']
    }

    let { pageNumber, nextPageToken } = context.state.listOrder
    if (isEmptyValue(pageNumber)) {
      pageNumber = 1
    }
    let pageToken = ''
    if (!isEmptyValue(nextPageToken)) {
      pageToken = nextPageToken + '-' + pageNumber
    }
    console.log('requestListOrders')
    console.log({
      posUuid,
      documentNo,
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
    requestListOrders({
      posUuid: posUuid!,
      documentNo: documentNo?.toString(),
      businessPartnerUuid: businessPartnerUuid!,
      grandTotal,
      openAmount: openAmount!,
      isPaid: isPaid!,
      isProcessed: isProcessed!,
      isAisleSeller: isAisleSeller!,
      isInvoiced: isInvoiced!,
      dateOrderedFrom,
      dateOrderedTo,
      salesRepresentativeUuid: salesRepresentativeUuid!,
      pageToken
    })
      .then((responseOrdersList: IListOrdersResponse) => {
        if (isEmptyValue(nextPageToken) || isEmptyValue(pageToken)) {
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
        // showMessage({
        //   type: 'info',
        //   message: error.message,
        //   showClose: true
        // })
      })
  },
  setOrder(context: OrderActionContext, order: IOrderData) {
    context.commit('setOrder', order)
  },
  currentOrder(context: OrderActionContext, findOrder: IOrderData) {
    context.commit('findOrder', findOrder)
  },
  findOrderServer(context: OrderActionContext, orderUuid: string) {
    if (typeof orderUuid === 'string' && !isEmptyValue(orderUuid)) {
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
