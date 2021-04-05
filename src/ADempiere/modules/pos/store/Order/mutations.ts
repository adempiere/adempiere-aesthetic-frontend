import { MutationTree } from 'vuex'
import { IOrderData, OrderState } from '../../POSType'

type OrderMutationTree = MutationTree<OrderState>

export const mutations: OrderMutationTree = {
  setOrder(state: OrderState, order: IOrderData) {
    state.order = order
  },
  setListOrder(state, listOrder) {
    state.listOrder = {
      ...state.listOrder,
      ...listOrder
    }
  },
  setOrdersListPageNumber(state: OrderState, pageNumber: number) {
    state.listOrder.pageNumber = pageNumber
  },
  showListOrders(state: OrderState, isShow: boolean) {
    state.listOrder.isShowPopover = isShow
  },
  setIsReloadListOrders(state: OrderState) {
    state.listOrder.isReload = true
  },
  currentOrder(state: OrderState, currentOrder) {
    state.currentOrder = currentOrder
  },
  findOrder(state: OrderState, findOrder: IOrderData) {
    state.findOrder = findOrder
  }
}
