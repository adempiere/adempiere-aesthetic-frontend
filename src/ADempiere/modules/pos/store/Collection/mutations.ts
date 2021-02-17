import { MutationTree } from 'vuex'
import { CollectionState, IPaymentsData } from '../../POSType'

type CollectionMutationTree = MutationTree<CollectionState>

export const mutations: CollectionMutationTree = {
  addPaymentBox(state: CollectionState, paymentBox) {
    state.paymentBox.push(paymentBox)
  },
  currencyMultiplyRate(state: CollectionState, multiplyRate: number) {
    state.multiplyRate = multiplyRate
  },
  currencyDivideRate(state: CollectionState, divideRate: number) {
    state.divideRate = divideRate
  },
  currencyMultiplyRateCollection(state: CollectionState, multiplyRateCollection: number) {
    state.multiplyRateCollection = multiplyRateCollection
  },
  currencyDivideRateCollection(state: CollectionState, divideRateCollection: number) {
    state.divideRateCollection = divideRateCollection
  },
  setListPayments(state: CollectionState, list: IPaymentsData[]) {
    state.listPayments = list
  },
  setTenderTypeDisplaye(state: CollectionState, tenderTypeDisplaye: any[]) {
    state.tenderTypeDisplaye = tenderTypeDisplaye
  }
}
