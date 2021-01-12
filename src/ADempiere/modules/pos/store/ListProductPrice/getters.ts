import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { IListProductPriceItemData, ListProductPriceState } from '../../POSType'

type ListProductPriceGetterTree = GetterTree<ListProductPriceState, IRootState>

export const getters: ListProductPriceGetterTree = {
  getProductPrice: (state: ListProductPriceState): IListProductPriceItemData => {
    if (!state.productPrice || !state.productPrice.isLoaded) {
      return {
        isLoaded: false,
        isReload: true,
        recordCount: 0,
        nextPageToken: undefined,
        list: []
      }
    }
    return state.productPrice
  }
}
