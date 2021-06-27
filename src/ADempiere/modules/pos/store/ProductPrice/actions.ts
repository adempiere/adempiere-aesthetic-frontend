import { IRootState } from '@/store'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { extractPagingToken, isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { ActionContext, ActionTree } from 'vuex'
import { getProductPriceList } from '../../POSService'
import { IListProductPriceResponse, IPointOfSalesData, ListProductPriceState } from '../../POSType'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import language from '@/lang'
import { IPriceListData } from '@/ADempiere/modules/core'

type ListProductPriceActionContext = ActionContext<ListProductPriceState, IRootState>
type ListProductPriceActionTree = ActionTree<ListProductPriceState, IRootState>

export const actions: ListProductPriceActionTree = {
  setProductPicePageNumber(context: ListProductPriceActionContext, pageNumber: number) {
    context.commit('setProductPicePageNumber', pageNumber)
    context.commit('setIsReloadProductPrice')

    // Not reload, watch in component to reload
    // dispatch('listProductPriceFromServer', {})
  },
  listProductPriceFromServer(context: ListProductPriceActionContext, payload: {
        containerUuid?: string
        pageNumber?: number
        searchValue: any
        currentPOS?: IPointOfSalesData
      }): Promise<IListProductPriceResponse> | undefined {
    const { containerUuid = payload.containerUuid || 'Products-Price-List', currentPOS } = payload
    let { pageNumber, searchValue } = payload
    const posUuid: string | undefined = isEmptyValue(currentPOS) ? context.rootGetters[Namespaces.PointOfSales + '/' + 'posAttributes'].currentPointOfSales.uuid : currentPOS?.uuid
    if (isEmptyValue(posUuid)) {
      const message = language.t('notifications.errorPointOfSale').toString()
      showMessage({
        type: 'info',
        message
      })
      console.warn(message)
      return
    }

    context.commit('setIsReloadProductPrice')
    let pageToken: string, token: string | undefined
    if (isEmptyValue(pageNumber)) {
      pageNumber = context.state.productPrice.pageNumber
      if (isEmptyValue(pageNumber)) {
        pageNumber = 1
      }
    }

    token = context.state.productPrice.token
    if (!isEmptyValue(token)) {
      pageToken = token + '-' + pageNumber
    }

    const { templateBusinessPartner } = <IPointOfSalesData>context.rootGetters[Namespaces.PointOfSales + '/' + 'posAttributes'].currentPointOfSales
    const { uuid: businessPartnerUuid } = templateBusinessPartner
    const { uuid: warehouseUuid } = context.rootGetters['user/getWarehouse']

    if (isEmptyValue(searchValue)) {
      searchValue = context.rootGetters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'ProductValue'
      })
    }

    return new Promise<IListProductPriceResponse>(resolve => {
      getProductPriceList({
        searchValue,
        priceListUuid: (context.rootGetters[Namespaces.PointOfSales + '/' + 'currentPriceList'] as Partial<IPriceListData>).uuid!,
        businessPartnerUuid,
        warehouseUuid: context.rootGetters[Namespaces.PointOfSales + '/' + 'currentWarehouse'].uuid,
        pageToken
      }).then((responseProductPrice: IListProductPriceResponse) => {
        if (isEmptyValue(token) || isEmptyValue(pageToken)) {
          token = extractPagingToken(responseProductPrice.nextPageToken)
        }

        context.commit('setListProductPrice', {
          ...responseProductPrice,
          isLoaded: true,
          isReload: false,
          businessPartnerUuid,
          warehouseUuid,
          token,
          pageNumber
        })

        resolve(responseProductPrice)
      }).catch(error => {
        console.warn(`getKeyLayoutFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
    })
  },
  listProductPriceFromServerProductInfo(context: ListProductPriceActionContext, payload: {
    containerUuid?: string
    pageNumber?: number // 1
    searchValue?: string
  }) {
    const {
      containerUuid = payload.containerUuid || 'Products-Price-List-ProductInfo'
    } = payload
    let { pageNumber, searchValue } = payload
    const posUuid = context.rootGetters[Namespaces.PointOfSales + '/' + 'posAttributes'].currentPointOfSales.uuid
    if (isEmptyValue(posUuid)) {
      const message = 'Sin punto de venta seleccionado'
      showMessage({
        type: 'info',
        message
      })
      console.warn(message)
      return
    }
    context.commit('setIsReloadProductPrice')
    let pageToken: string, token: string | undefined
    if (isEmptyValue(pageNumber)) {
      pageNumber = context.state.productPrice.pageNumber
      if (isEmptyValue(pageNumber)) {
        pageNumber = 1
      }

      token = context.state.productPrice.token
      if (!isEmptyValue(token)) {
        pageToken = token + '-' + pageNumber
      }
    }

    const getCurrentPOSData: IPointOfSalesData = context.rootGetters[Namespaces.PointOfSales + '/' + 'posAttributes'].currentPointOfSales
    const { templateBusinessPartner } = getCurrentPOSData
    const { uuid: businessPartnerUuid } = templateBusinessPartner
    const { uuid: warehouseUuid } = context.rootGetters['user/getWarehouse']

    if (isEmptyValue(searchValue)) {
      searchValue = context.rootGetters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'ProductValue'
      })
    }
    return new Promise<IListProductPriceResponse>(resolve => {
      getProductPriceList({
        searchValue: searchValue!,
        priceListUuid: (context.rootGetters[Namespaces.PointOfSales + '/' + 'currentPriceList'] as Partial<IPriceListData>).uuid!,
        businessPartnerUuid,
        warehouseUuid,
        pageToken
      }).then((responseProductPrice: IListProductPriceResponse) => {
        if (isEmptyValue(token) || isEmptyValue(pageToken)) {
          token = extractPagingToken(responseProductPrice.nextPageToken)
        }

        context.commit('setListProductPrice', {
          ...responseProductPrice,
          isLoaded: true,
          isReload: false,
          businessPartnerUuid,
          warehouseUuid,
          token,
          pageNumber
        })

        resolve(responseProductPrice)
      }).catch(error => {
        console.warn(`getKeyLayoutFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
    })
  },
  updateSearch(context: ListProductPriceActionContext, newValue: string) {
    context.commit('updateSearchProduct', newValue)
  }
}
