import { MutationTree } from 'vuex'
import Vue from 'vue'
import { IPointOfSalesData, IPOSData, PointOfSalesState } from '@/ADempiere/modules/pos/POSType'
import { IConversionRateData, IPriceListData } from '@/ADempiere/modules/core'

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
  listWarehouses(state, listWarehouses) {
    state.listWarehouses = listWarehouses
  },
  currentListPrices(state, listPrices: IPriceListData) {
    state.currentlistPrices = listPrices
  },
  currentWarehouse(state, warehouse) {
    state.currentWarehouse = warehouse
  },
  listPrices(state, listPrices: IPriceListData) {
    state.listPrices = listPrices
  },
  listCurrencies(state, listCurrency) {
    state.listCurrency = listCurrency
  },
  conversionList(state: PointOfSalesState, conversion: Partial<IConversionRateData>) {
    state.conversionList.push(conversion)
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
