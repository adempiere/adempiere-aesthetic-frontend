import { PointOfSalesState } from '../../POSType'

export const state: PointOfSalesState = {
  showPOSOptions: false,
  showPOSKeyLayout: false,
  showPOSCollection: false,
  currentPOS: {},
  listPointOfSales: {},
  listWarehouses: {},
  listPrices: {},
  currentlistPrices: {},
  currentWarehouse: {},
  listCurrency: [],
  conversionList: [],
  pointOfSales: {
    isLoaded: false,
    isReload: true,
    recordCount: 0,
    nextPageToken: undefined
  }
}
