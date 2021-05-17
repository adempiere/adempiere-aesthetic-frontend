import { MutationTree } from 'vuex'
import Vue from 'vue'
import { IPointOfSalesData, IPOSData, PointOfSalesState } from '@/ADempiere/modules/pos/POSType'

type PointOfSalesMutationTree = MutationTree<PointOfSalesState>

export const mutations: PointOfSalesMutationTree = {
  setPontOfSales(state: PointOfSalesState, pos: IPOSData) {
    state.pointOfSales = pos
  },
  setCurrentPOS(state: PointOfSalesState, pos: IPointOfSalesData) {
    Vue.set(state.pointOfSales, 'currentPOS', pos)
  },
  listPointOfSales(state: PointOfSalesState, listPointOfSales) {
    state.listPointOfSales = listPointOfSales
  },
  currentPointOfSales(state: PointOfSalesState, currentPointOfSales: Partial<IPointOfSalesData>) {
    state.currentPOS = currentPointOfSales
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
