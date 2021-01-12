import { IRootState } from '@/store'
import { ActionContext, GetterTree } from 'vuex'
import { IPointOfSalesData, IPOSData, PointOfSalesState } from '../../POSType'

type PointOfSalesGetterTree = GetterTree<PointOfSalesState, IRootState>
type PointOfSalesActionContext = ActionContext<PointOfSalesState, IRootState>

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
  getCurrentPOS: (state: PointOfSalesState): IPointOfSalesData | undefined => {
    if (!state.pointOfSales) {
      return undefined
    }
    // return state.pointOfSales.currentPOS
    return state.pointOfSales.currentPOS
  },
  // current pos uuid
  getPointOfSalesUuid: (
    state: PointOfSalesState,
    context: PointOfSalesActionContext
  ): string | undefined => {
    const currentPOS: IPOSData| undefined = context.getters.getCurrentPOS()
    if (!currentPOS) {
      return undefined
    }
    // return currentPOS.uuid
    return currentPOS.userUuid
  },
  getSellingPointsList: (state: PointOfSalesState, context: PointOfSalesActionContext): IPointOfSalesData[] => {
    return context.getters.getPointOfSales().list
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
