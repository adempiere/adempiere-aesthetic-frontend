import { IRootState } from '@/store'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { ActionContext, ActionTree } from 'vuex'
import {
  listPointOfSales,
  listWarehouse,
  listPrices,
  listCurrencies
} from '../../POSService'
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
    listPointOfSales({
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
  listWarehouseFromServer(context: PointOfSalesActionContext, posUuid: string) {
    listWarehouse({
      posUuid
    })
      .then(response => {
        context.commit('listWarehouses', response.records)
      })
      .catch(error => {
        console.warn(`listWarehouseFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  listPricesFromServer(context: PointOfSalesActionContext, point: IPointOfSalesData) {
    listPrices({
      posUuid: point.uuid!
    })
      .then(response => {
        context.commit('listPrices', response.list)
      })
      .catch(error => {
        console.warn(`listPricesFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  listCurrenciesFromServer(context: PointOfSalesActionContext, posUuid: string) {
    listCurrencies({
      posUuid
    })
      .then(response => {
        context.commit('listCurrencies', response.records)
      })
      .catch(error => {
        console.warn(`listPricesFromServer: ${error.message}. Code: ${error.code}.`)
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

    context.dispatch('listWarehouseFromServer', posToSet.uuid)
    context.dispatch('listCurrenciesFromServer', posToSet.uuid)
    context.dispatch('listPricesFromServer', posToSet)
    context.commit('currentListPrices', posToSet.priceList)
    context.commit('currentWarehouse', context.rootGetters[Namespaces.User + '/' + 'getWarehouse'])
    context.commit(Namespaces.Payments + '/' + 'resetConversionRate', [], { root: true })
    context.commit(Namespaces.KeyLayout + '/' + 'setIsReloadKeyLayout', undefined, { root: true })
    context.commit(Namespaces.ProductPrice + '/' + 'setIsReloadProductPrice', undefined, { root: true })
    context.commit(Namespaces.Order + '/' + 'setIsReloadListOrders', undefined, { root: true })
    context.commit('setShowPOSKeyLayout', false)
  }
}
