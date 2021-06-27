import { IPriceListData } from '@/ADempiere/modules/core'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import {
  ICurrentOrderData,
  IKeyLayoutOrWithoutResponse,
  IOrderData,
  IPOSAttributesData,
  PointOfSalesState
} from '../../POSType'

type PointOfSalesGetterTree = GetterTree<PointOfSalesState, IRootState>

const withoutResponse = {
  isLoaded: false,
  isReload: true,
  recordCount: 0,
  nextPageToken: undefined
}

const isProcessed = (order?: Partial<IOrderData>): boolean => {
  if (
    !isEmptyValue(order?.documentStatus?.value) &&
    (order?.documentStatus?.value === 'CO' ||
      order?.documentStatus?.value === 'VO' ||
      order?.documentStatus?.value === 'IP' ||
      order?.documentStatus?.value === 'IP')
  ) {
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
  posAttributes: (
    state: PointOfSalesState,
    getters,
    rootState
  ): IPOSAttributesData => {
    // Assign Types
    const currentOrder: ICurrentOrderData = {
      ...rootState.orderModule.order,
      lineOrder: rootState.orderLinesModule.listOrderLine,
      listPayments: rootState.paymentsModule.listPayments,
      isProcessed: isProcessed(rootState.orderModule.order)
    }
    return {
      listPointOfSales: state.listPointOfSales,
      currentPointOfSales: {
        ...state.currentPOS,
        listOrder: rootState.orderModule.listOrder,
        listWarehouses: state.listWarehouses,
        listPrices: state.listPrices,
        currentOrder: currentOrder
      }
    }
  },
  /**
   * Product Price Getters
   * List Product
   * Search Product
   */
  getProductPrice: (state, getters, rootState) => {
    if (isEmptyValue(rootState.productPriceModule.productPrice)) {
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
  getKeyLayout: (state, getters, rootState): IKeyLayoutOrWithoutResponse => {
    if (isEmptyValue(rootState.keyLayoutModule.keyLayout)) {
      return {
        ...withoutResponse,
        uuid: undefined,
        ordersList: []
      }
    }
    return rootState.keyLayoutModule.keyLayout
  },
  /**
   * Current Price List
   */
  currentPriceList: (state: PointOfSalesState): Partial<IPriceListData> => {
    if (!isEmptyValue(state.currentlistPrices)) {
      return state.currentlistPrices
    }
    return {}
  },
  /**
   * Current Warehouse
   */
  currentWarehouse: (state: PointOfSalesState): any => {
    if (!isEmptyValue(state.currentWarehouse)) {
      return state.currentWarehouse
    }
    return {}
  }
}
