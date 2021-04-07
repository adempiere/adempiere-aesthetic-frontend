import { IRootState } from '@/store'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { ActionTree, ActionContext } from 'vuex'
import { requestListOrderLines } from '../../POSService'
import {
  IListOrderLinesResponse,
  IOrderLineData,
  IOrderLineDataExtended,
  OrderLinesState
} from '../../POSType'

type OrderLinesActionTree = ActionTree<OrderLinesState, IRootState>
type OrderLinesActionContext = ActionContext<OrderLinesState, IRootState>

export const actions: OrderLinesActionTree = {
  listOrderLine(context: OrderLinesActionContext, params): void {
    context.commit('setListOrderLine', params)
  },
  listOrderLinesFromServer(
    context: OrderLinesActionContext,
    orderUuid: string
  ): void {
    requestListOrderLines({
      orderUuid
    })
      .then((response: IListOrderLinesResponse) => {
        const line: IOrderLineDataExtended[] = response.orderLineList.map(
          (lineItem: IOrderLineData) => {
            return {
              ...lineItem,
              quantityOrdered: lineItem.quantity,
              priceActual: lineItem.price,
              discount: lineItem.discountRate,
              product: {
                ...lineItem.product,
                priceStandard: lineItem.price,
                help: lineItem.help || ''
              },
              taxIndicator: lineItem.taxRate.taxIndicator,
              grandTotal: lineItem.lineNetAmount
            }
          }
        )
        context.commit('setListOrderLine', line)
      })
      .catch(error => {
        console.warn(
                    `listOrderLinesFromServer: ${error.message}. Code: ${error.code}.`
        )
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  updateOrderLines(
    context: OrderLinesActionContext,
    params: {
            uuid: string
            lineDescription?: string
            quantity?: number
            price?: number
            discountRate?: number
            help?: string
            product: {
                description?: string
                name?: string
                value?: any
            }
            taxRate: {
                taxIndicator?: string
            }
            lineNetAmount?: number
        }
  ): void {
    const line: IOrderLineDataExtended[] = context.getters.getListOrderLine
    const found: IOrderLineDataExtended[] = line.map(
      (element: IOrderLineDataExtended) => {
        if (element.uuid === params.uuid) {
          return {
            ...element,
            uuid: params.uuid,
            lineDescription:
                            params.lineDescription || element.lineDescription,
            quantityOrdered: params.quantity || element.quantity,
            priceActual: params.price || element.price,
            discount: params.discountRate || element.discountRate,
            product: {
              ...element.product,
              description:
                                params.product.description ||
                                element.product.description,
              priceStandard:
                                params.price || element.product.priceStandard,
              help: params.help || element.product.help,
              name: params.product.name || element.product.name,
              value: params.product.value || element.product.value
            },
            taxIndicator:
                            params.taxRate.taxIndicator ||
                            element.taxRate.taxIndicator,
            grandTotal:
                            params.lineNetAmount || element.lineNetAmount
          }
        }
        return {
          ...element
        }
      }
    )
    context.commit('setListOrderLine', found)
  }
}
