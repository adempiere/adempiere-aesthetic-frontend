import { MutationTree } from 'vuex'
import { CollectionState } from '../../POSType'

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
  }
}
