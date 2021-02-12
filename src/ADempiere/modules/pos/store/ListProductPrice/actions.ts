import { IRootState } from '@/store'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { extractPagingToken } from '@/ADempiere/shared/utils/valueUtils'
import { ActionContext, ActionTree } from 'vuex'
import { requestListProductPrice } from '../../POSService'
import { IListProductPriceResponse, IPointOfSalesData, ListProductPriceState } from '../../POSType'
import { Namespaces } from '@/ADempiere/shared/utils/types'

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
      }): Promise<IListProductPriceResponse> | undefined {
    const { containerUuid = payload.containerUuid || 'Products-Price-List' } = payload
    let { pageNumber, searchValue } = payload
    const posUuid: string | undefined = context.rootGetters[Namespaces.PointOfSales + '/' + 'getPointOfSalesUuid']()
    if (!posUuid) {
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
    if (!pageNumber) {
      pageNumber = context.state.productPrice.pageNumber || 1
      token = context.state.productPrice.token
      if (token) {
        pageToken = token + '-' + pageNumber
      }
    }

    const { priceList, templateBusinessPartner } = <IPointOfSalesData>context.rootGetters[Namespaces.PointOfSales + '/' + 'getCurrentPOS']()
    const { uuid: businessPartnerUuid } = templateBusinessPartner
    const { uuid: priceListUuid } = priceList
    const { uuid: warehouseUuid } = context.rootGetters['user/getWarehouse']

    if (!searchValue) {
      searchValue = context.rootGetters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'ProductValue'
      })
    }

    return new Promise<IListProductPriceResponse>(resolve => {
      requestListProductPrice({
        searchValue,
        priceListUuid,
        businessPartnerUuid,
        warehouseUuid,
        pageToken
      }).then((responseProductPrice: IListProductPriceResponse) => {
        if (!token || !pageToken) {
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
    const posUuid = context.rootGetters[Namespaces.PointOfSales + '/' + 'getPointOfSalesUuid']
    if (!posUuid) {
      const message = 'Sin punto de venta seleccionado'
      showMessage({
        type: 'info',
        message
      })
      console.warn(message)
      return
    }
    context.commit(Namespaces.ListProductPrice + '/' + 'setIsReloadProductPrice')
    let pageToken: string, token: string | undefined
    if (!pageNumber) {
      pageNumber = context.state.productPrice.pageNumber
      if (!pageNumber) {
        pageNumber = 1
      }

      token = context.state.productPrice.token
      if (token) {
        pageToken = token + '-' + pageNumber
      }
    }

    const getCurrentPOSData: IPointOfSalesData = context.rootGetters[Namespaces.PointOfSales + '/' + 'getCurrentPOS']
    const { priceList, templateBusinessPartner } = getCurrentPOSData
    const { uuid: businessPartnerUuid } = templateBusinessPartner
    const { uuid: priceListUuid } = priceList
    const { uuid: warehouseUuid } = context.rootGetters['user/getWarehouse']

    if (!searchValue) {
      searchValue = context.rootGetters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'ProductValue'
      })
    }
    return new Promise<IListProductPriceResponse>(resolve => {
      requestListProductPrice({
        searchValue: searchValue!,
        priceListUuid,
        businessPartnerUuid,
        warehouseUuid,
        pageToken
      }).then((responseProductPrice: IListProductPriceResponse) => {
        if (!token || !pageToken) {
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
    context.commit('updtaeSearchProduct', newValue)
  }
}
