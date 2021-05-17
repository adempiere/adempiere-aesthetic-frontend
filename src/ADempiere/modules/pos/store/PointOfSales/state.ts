import { PointOfSalesState } from '../../POSType'

export const state: PointOfSalesState = {
  showPOSOptions: false,
  showPOSKeyLayout: false,
  showPOSCollection: false,
  currentPOS: {},
  listPointOfSales: {},
  pointOfSales: {
    isLoaded: false,
    isReload: true,
    recordCount: 0,
    nextPageToken: undefined
  }
}
