import { RootState } from '@/ADempiere/shared/store/types'
import { GetterTree } from 'vuex'
import { IOrderData, OrderState } from '../../POSType'

type OrderGetterTree = GetterTree<OrderState, RootState>

export const getters: OrderGetterTree = {
  getOrder: (state: OrderState): IOrderData | undefined => {
    return state.order
  },
  getListOrder: (state: OrderState) => {
    if (!(state.listOrder)) {
      return {
        isLoaded: false,
        isReload: true,
        recordCount: 0,
        nextPageToken: undefined,
        ordersList: []
      }
    }
    return state.listOrder
  },
  getCurrentOrder: (state: OrderState): IOrderData | undefined => {
    return state.currentOrder
  },
  getFindOrder: (state: OrderState): IOrderData | undefined => {
    return state.findOrder
  }
}
