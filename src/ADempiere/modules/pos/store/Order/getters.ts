import { Namespaces } from '@/ADempiere/shared/utils/types'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { IListOrderItemData, IOrderData, IOrderLineDataExtended, IPaymentsData, OrderState } from '../../POSType'

type OrderGetterTree = GetterTree<OrderState, IRootState>

export const getters: OrderGetterTree = {
  getOrder: (state: OrderState): IOrderData | undefined => {
    return state.order as IOrderData
  },
  getPos: (state: OrderState, getters, rootState, rootGetters) => {
    const OrderPos: {
      currentOrder?: Partial<IOrderData>
      lineOrder: IOrderLineDataExtended[]
      listPayments: IPaymentsData[]
      listOrder: IListOrderItemData | Partial<IListOrderItemData>
      isProcessed: boolean
    } = {
      currentOrder: state.order,
      listOrder: getters.getListOrder,
      lineOrder: rootGetters[Namespaces.OrderLines + '/' + 'getListOrderLine'],
      listPayments: rootGetters[Namespaces.Payments + '/' + 'getListPayments'],
      isProcessed: getters.getIsProcessed
    }
    return OrderPos
  },
  getIsProcessed: (state: OrderState): boolean => {
    const order = state.order
    if (order?.documentStatus && order.documentStatus.value &&
     (order.documentStatus.value === 'CO' || order.documentStatus.value === 'VO' || order.documentStatus.value === 'IP' || order.documentStatus.value === 'IP')) {
      return true
    }
    return false
  },
  getListOrder: (state: OrderState): IListOrderItemData | Partial<IListOrderItemData> => {
    if (isEmptyValue(state.listOrder)) {
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
