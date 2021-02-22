import { MutationTree } from 'vuex'
import Vue from 'vue'
import { IPointOfSalesData, IPOSData, PointOfSalesState } from '@/ADempiere/modules/pos/POSType'

type PointOfSalesMutationTree = MutationTree<PointOfSalesState>

export const mutations: PointOfSalesMutationTree = {
  resetStatePointOfSales(state: PointOfSalesState) {
    state = {
      showPOSOptions: false,
      showPOSKeyLayout: false,
      showPOSCollection: false,
      currentPOS: {},
      pointOfSales: {
        isLoaded: false,
        isReload: true,
        recordCount: 0,
        nextPageToken: undefined
      }
    }
  },
  setPontOfSales(state: PointOfSalesState, pos: IPOSData) {
    state.pointOfSales = pos
  },
  setCurrentPOS(state: PointOfSalesState, pos: IPointOfSalesData) {
    Vue.set(state.pointOfSales, 'currentPOS', pos)
  },
  setShowPOSOptions(state: PointOfSalesState, isShowedOptions: boolean) {
    state.showPOSOptions = isShowedOptions
  },
  setShowPOSKeyLayout(state: PointOfSalesState, isShowedKeyLayout: boolean) {
    state.showPOSKeyLayout = isShowedKeyLayout
  },
  setShowPOSCollection(
    state: PointOfSalesState,
    isShowedCollection: boolean
  ) {
    state.showPOSCollection = isShowedCollection
  }
}
