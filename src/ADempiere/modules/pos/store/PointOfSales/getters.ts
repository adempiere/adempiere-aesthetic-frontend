import { IRootState } from '@/store'
import { ActionContext, GetterTree } from 'vuex'
import { IPointOfSalesData, IPOSData, PointOfSalesState } from '../../POSType'

type PointOfSalesGetterTree = GetterTree<PointOfSalesState, IRootState>

export const getters: PointOfSalesGetterTree = {
  getPointOfSales: (state: PointOfSalesState): IPOSData => {
    if (!state.pointOfSales) {
      return {
        isLoaded: false,
        isReload: true,
        recordCount: 0,
        nextPageToken: undefined,
        list: []
      }
    }
    return state.pointOfSales
  },
  // current pos info
  getCurrentPOS: (state: PointOfSalesState, getters, rootState): IPointOfSalesData | undefined => {
    const userUuid: string = rootState.user.userUuid
    let currentPOS
    const sellingPointList = state.pointOfSales.list
    if (sellingPointList && sellingPointList.length > 1) {
      currentPOS = state.pointOfSales.list?.find(elem => elem.salesRepresentative.uuid === userUuid)
    }
    if (currentPOS) {
      return currentPOS
    }
    if (!state.pointOfSales.currentPOS && sellingPointList && sellingPointList.length > 0) {
      return state.pointOfSales.list![0]
    }
    if (state.pointOfSales.currentPOS) {
      return state.pointOfSales.currentPOS as IPointOfSalesData
    }
    return undefined
  },
  // current pos uuid
  getPointOfSalesUuid: (
    state: PointOfSalesState, getters
  ): string | undefined => {
    const currentPOS: IPOSData| undefined = getters.getCurrentPOS
    if (!currentPOS) {
      return undefined
    }
    // return currentPOS.uuid
    return currentPOS.uuid
  },
  getSellingPointsList: (state: PointOfSalesState, getters): IPointOfSalesData[] => {
    return getters.getPointOfSales.list
  },
  getIsShowPOSOptions: (state: PointOfSalesState): boolean => {
    return state.showPOSOptions
  },
  getShowPOSKeyLayout: (state: PointOfSalesState): boolean => {
    return state.showPOSKeyLayout
  },
  getShowCollectionPos: (state: PointOfSalesState): boolean => {
    return state.showPOSCollection
  }
}
