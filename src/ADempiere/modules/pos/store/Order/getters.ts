import { Namespaces } from '@/ADempiere/shared/utils/types'
import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { IListOrderItemData, IOrderData, IOrderLineDataExtended, IPaymentsData, IPointOfSalesData, OrderState, PointOfSalesState } from '../../POSType'

type OrderGetterTree = GetterTree<OrderState, IRootState>

export const getters: OrderGetterTree = {
  getOrder: (state: OrderState): IOrderData | undefined => {
    return state.order as IOrderData
  },
  getPos: (state: OrderState, getters) => {
    const OrderPos: OrderState & {
      lineOrder: IOrderLineDataExtended[]
      listPayments: IPaymentsData[]
      isProcessed: boolean
    } = {
      currentOrder: state.order as IOrderData,
      listOrder: getters.getListOrder,
      lineOrder: getters[Namespaces.OrderLines + '/' + 'getListOrderLine'],
      listPayments: getters[Namespaces.Payments + '/' + 'getListPayments'],
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
