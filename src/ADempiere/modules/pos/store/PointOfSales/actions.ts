import { IRootState } from '@/store'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { ActionContext, ActionTree } from 'vuex'
import { requestListPointOfSales } from '../../POSService'
import {
  IListPointOfSalesResponse,
  IPointOfSalesData,
  PointOfSalesState
} from '../../POSType'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Route } from 'vue-router'
import router from '@/router'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'

type PointOfSalesActionContext = ActionContext<PointOfSalesState, IRootState>
type PointOfSalesActionTree = ActionTree<PointOfSalesState, IRootState>

export const actions: PointOfSalesActionTree = {
  /**
     * List point of sales terminal
     * @param {number} posToSet id to set
     */
  listPointOfSalesFromServer(
    context: PointOfSalesActionContext,
    posToSet = null
  ) {
    const userUuid: string = context.rootState.user.userUuid
    let pos: IPointOfSalesData | undefined, listPos: IPointOfSalesData[]
    requestListPointOfSales({
      userUuid
    })
      .then((response: IListPointOfSalesResponse) => {
        listPos = response.list
        if (!isEmptyValue(posToSet)) {
          pos = listPos.find((itemPOS) => itemPOS.id === parseInt(posToSet))
        }
        if (isEmptyValue(pos) && isEmptyValue(posToSet)) {
          pos = listPos.find(itemPOS => itemPOS.salesRepresentative.uuid === userUuid)
        }
        if (isEmptyValue(pos)) {
          pos = listPos[0]
        }
        context.commit('listPointOfSales', listPos)
        context.dispatch('setCurrentPOS', pos)
      })
      .catch(error => {
        console.warn(
                    `listPointOfSalesFromServer: ${error.message}. Code: ${error.code}.`
        )
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  setCurrentPOS(
    context: PointOfSalesActionContext,
    posToSet: IPointOfSalesData
  ) {
    context.commit('currentPointOfSales', posToSet)
    const currentPOS: IPointOfSalesData = posToSet
    const oldRoute: Route = context.rootState.route
    router.push({
      name: oldRoute.name!,
      params: {
        ...oldRoute.params
      },
      query: {
        ...oldRoute.query,
        pos: String(posToSet.id)
      }
    }).catch(
      /* eslint-disable-next-line @typescript-eslint/no-empty-function */
      () => {})

    context.commit(Namespaces.KeyLayout + '/' + 'setIsReloadKeyLayout', undefined, { root: true })
    context.commit(Namespaces.ProductPrice + '/' + 'setIsReloadProductPrice', undefined, { root: true })
    context.commit(Namespaces.Order + '/' + 'setIsReloadListOrders', undefined, { root: true })
    context.commit('setShowPOSKeyLayout', false)
    context.dispatch(Namespaces.Order + '/' + 'listOrdersFromServer', {
      posUuid: currentPOS.uuid
    }, { root: true })
    context.dispatch(Namespaces.ProductPrice + '/' + 'listProductPriceFromServer', {
      currentPOS
    }, { root: true })
  }
}
