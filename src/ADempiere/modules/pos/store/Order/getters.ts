import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { IListOrderItemData, IOrderData, OrderState } from '../../POSType'

type OrderGetterTree = GetterTree<OrderState, IRootState>

export const getters: OrderGetterTree = {
  getOrder: (state: OrderState): IOrderData | undefined => {
    return state.order as IOrderData
  },
  getListOrder: (state: OrderState): IListOrderItemData | Partial<IListOrderItemData> => {
    if (!(state.listOrder)) {
      return {
        isLoaded: false,
        isReload: true,
        recordCount: 0,
        nextPageToken: undefined,
        list: []
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
