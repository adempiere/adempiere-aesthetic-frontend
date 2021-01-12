import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import {
  IOrderLineDataExtended,
  OrderLinesState
} from '../../POSType'

type OrderLinesGetterTree = GetterTree<OrderLinesState, IRootState>

export const getters: OrderLinesGetterTree = {
  getListOrderLine: (state: OrderLinesState): IOrderLineDataExtended[] => {
    return state.listOrderLine
  }
}
