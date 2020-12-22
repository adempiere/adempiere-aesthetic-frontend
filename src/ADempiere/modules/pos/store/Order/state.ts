import { OrderState } from '../../POSType'

export const state: OrderState = {
  order: undefined,
  findOrder: undefined,
  listOrder: {
    isLoaded: false,
    isReload: true,
    recordCount: 0,
    nextPageToken: undefined,
    isShowPopover: false
  }
}
