import { ListProductPriceState } from '../../POSType'

export const state: ListProductPriceState = {
  productPrice: {
    isLoaded: false,
    isReload: true,
    recordCount: 0,
    nextPageToken: undefined,
    isShowPopoverField: false, // with field
    isShowPopoverMenu: false // with menu
  }
}
