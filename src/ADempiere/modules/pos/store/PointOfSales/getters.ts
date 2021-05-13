import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { IOrderData, PointOfSalesState } from '../../POSType'

type PointOfSalesGetterTree = GetterTree<PointOfSalesState, IRootState>

const withoutResponse = {
  isLoaded: false,
  isReload: true,
  recordCount: 0,
  nextPageToken: undefined
}

const isProcessed = (order?: Partial<IOrderData>): boolean => {
  if (!isEmptyValue(order?.documentStatus?.value) &&
    (order?.documentStatus?.value === 'CO' ||
     order?.documentStatus?.value === 'VO' ||
     order?.documentStatus?.value === 'IP' ||
     order?.documentStatus?.value === 'IP')) {
    return true
  }
  return false
}

export const getters: PointOfSalesGetterTree = {
  /**
   * Point of Sale Attributes
   * List Point Of Sales
   * Current Point Of Sales
   * Current Order
   * List Order Lines
   * List Payment Order
   * Lst Order
   */
  posAttributes: (state: PointOfSalesState, getters, rootState) => {
    return {
      listPointOfSales: state.listPointOfSales,
      currentPointOfSales: {
        ...state.currentPOS,
        listOrder: rootState.orderModule.listOrder,
        currentOrder: {
          ...rootState.orderModule.order,
          lineOrder: rootState.orderLinesModule.listOrderLine,
          listPayments: rootState.paymentsModule.listPayments,
          isProcessed: isProcessed(rootState.orderModule.order)
        }
      }
    }
  },
  /**
   * Product Price Getters
   * List Product
   * Search Product
   */
  getProductPrice: (state, getters, rootState) => {
    if (isEmptyValue(rootState.productPriceModule.productPrice) || !rootState.productPriceModule.productPrice.isLoaded) {
      return {
        ...withoutResponse,
        productPricesList: []
      }
    }
    return rootState.productPriceModule.productPrice
  },
  getSearchProduct: (state, getters, rootState): string => {
    return rootState.productPriceModule.searchProduct
  },
  getIsShowPOSOptions: (state: PointOfSalesState): boolean => {
    return state.showPOSOptions
  },
  getShowPOSKeyLayout: (state: PointOfSalesState): boolean => {
    return state.showPOSKeyLayout
  },
  getShowCollectionPos: (state: PointOfSalesState): boolean => {
    return state.showPOSCollection
  },
  getKeyLayout: (state, getters, rootState) => {
    if (isEmptyValue(rootState.keyLayoutModule.keyLayout)) {
      return {
        ...withoutResponse,
        uuid: undefined,
        ordersList: []
      }
    }
    return rootState.keyLayoutModule.keyLayout
  }
}
