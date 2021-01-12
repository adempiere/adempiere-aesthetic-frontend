import { MutationTree } from 'vuex'
import Vue from 'vue'
import { ListProductPriceState } from '../../POSType'
import { IProductPriceData } from '@/ADempiere/modules/core/CoreType'

type ListProductPriceMutationTree = MutationTree<ListProductPriceState>

export const mutations: ListProductPriceMutationTree = {
  setListProductPrice(state: ListProductPriceState, productsPrices: {
      nextPageToken: string
      recordCount: number
      list: IProductPriceData[]
      isLoaded: boolean
      isReload: boolean
      pageNumber?: number
      token?: string
      businessPartnerUuid: string
      warehouseUuid: string
    }) {
    state.productPrice = {
      ...state.productPrice,
      ...productsPrices
    }
  },
  setProductPicePageNumber(state: ListProductPriceState, pageNumber: number) {
    state.productPrice.pageNumber = pageNumber
  },
  showListProductPrice(state: ListProductPriceState, payload: {
          attribute: string
          isShowed: boolean
      }) {
    Vue.set(state.productPrice, payload.attribute, payload.isShowed)
  },
  setIsReloadProductPrice(state: ListProductPriceState) {
    Vue.set(state.productPrice, 'isReload', true)
    Vue.set(state.productPrice, 'isLoaded', false)
  }
}
