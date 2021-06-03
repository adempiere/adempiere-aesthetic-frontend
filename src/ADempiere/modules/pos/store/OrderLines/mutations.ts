import { MutationTree } from 'vuex'
import { IOrderLineDataExtended, OrderLinesState } from '../../POSType'

type OrderLinesMutationTree = MutationTree<OrderLinesState>

export const mutations: OrderLinesMutationTree = {
  setListOrderLine(state: OrderLinesState, listOrderLine: IOrderLineDataExtended[]) {
    state.listOrderLine = listOrderLine
  },
  setLine(state: OrderLinesState, line) {
    state.line = line
  },
  pin(state: OrderLinesState, pin: boolean) {
    state.validatePin = pin
  }
}
