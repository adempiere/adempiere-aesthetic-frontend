import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { CollectionState, IPaymentsData } from '../../POSType'

type CollectionGetterTree = GetterTree<CollectionState, IRootState>

export const getters: CollectionGetterTree = {
  getPaymentBox: (state: CollectionState): any[] => {
    return state.paymentBox
  },
  getMultiplyRate: (state: CollectionState): number => {
    return state.multiplyRate
  },
  getDivideRate: (state: CollectionState): number => {
    return state.divideRate
  },
  getMultiplyRateCollection: (state: CollectionState): number => {
    return state.multiplyRateCollection
  },
  getDivideRateCollection: (state: CollectionState): number => {
    return state.divideRateCollection
  },
  getListPayments: (state: CollectionState): IPaymentsData[] => {
    console.log(state.listPayments)
    return state.listPayments
  },
  getTenderTypeDisplaye: (state: CollectionState): any[] => {
    return state.tenderTypeDisplaye
  }
}
