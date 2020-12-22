import { RootState } from '@/ADempiere/shared/store/types'
import { GetterTree } from 'vuex'
import {
  IOrderLineDataExtended,
  OrderLinesState
} from '../../POSType'

type OrderLinesGetterTree = GetterTree<OrderLinesState, RootState>

export const getters: OrderLinesGetterTree = {
  getListOrderLine: (state: OrderLinesState): IOrderLineDataExtended[] => {
    return state.listOrderLine
  }
}
