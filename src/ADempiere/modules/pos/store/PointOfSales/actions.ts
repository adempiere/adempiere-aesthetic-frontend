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

    requestListPointOfSales({
      userUuid
    })
      .then((response: IListPointOfSalesResponse) => {
        // TODO: Add organization
        context.commit('setPontOfSales', {
          ...response,
          userUuid
        })

        const posList: IPointOfSalesData[] = response.list
        const getterPos: string = context.getters[Namespaces.PointOfSales + '/' + 'getPointOfSalesUuid']
        let pos: IPointOfSalesData | undefined
        if (posList) {
          if (getterPos) {
            pos = posList.find(
              (itemPOS: IPointOfSalesData) =>
                itemPOS.uuid === getterPos
            )
          }

          // match with route.query.pos
          if (!pos && posToSet) {
            pos = posList.find(
              (itemPOS: IPointOfSalesData) =>
                itemPOS.id === posToSet
            )
          }

          // set first element in array list
          if (!pos) {
            pos = posList[0]
          }
        }
        if (!pos) {
          pos = undefined
        }
        if (pos && pos.uuid !== getterPos) {
          context.dispatch('setCurrentPOS', pos)
        }
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
    context.commit('setCurrentPOS', posToSet)

    const oldRoute: Route = context.rootState.route

    context.rootState.router.push({
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
    context.commit(Namespaces.ListProductPrice + '/' + 'setIsReloadProductPrice', undefined, { root: true })
    context.commit(Namespaces.Order + '/' + 'setIsReloadListOrders', undefined, { root: true })
    context.commit('setShowPOSKeyLayout', false)
    context.dispatch(Namespaces.Payments + '/' + 'deleteAllCollectBox', undefined, { root: true })
  }
}
