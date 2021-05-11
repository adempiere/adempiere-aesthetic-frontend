import { MutationTree } from 'vuex'
import { PaymentsState, IPaymentsData } from '../../POSType'

type PaymentsMutatiionTree = MutationTree<PaymentsState>

export const mutations: PaymentsMutatiionTree = {
  addPaymentBox(state: PaymentsState, paymentBox) {
    state.paymentBox.push(paymentBox)
  },
  currencyMultiplyRate(state: PaymentsState, multiplyRate: number) {
    state.multiplyRate = multiplyRate
  },
  currencyDivideRate(state: PaymentsState, divideRate: number) {
    state.divideRate = divideRate
  },
  currencyMultiplyRateCollection(state: PaymentsState, multiplyRateCollection: number) {
    state.multiplyRateCollection = multiplyRateCollection
  },
  currencyDivideRateCollection(state: PaymentsState, divideRateCollection: number) {
    state.divideRateCollection = divideRateCollection
  },
  setListPayments(state: PaymentsState, list: { payments: IPaymentsData[], isLoaded: boolean}) {
    state.listPayments = list
  },
  setTenderTypeDisplaye(state: PaymentsState, tenderTypeDisplaye: any[]) {
    state.tenderTypeDisplaye = tenderTypeDisplaye
  },
  setCurrencyDisplaye(state: PaymentsState, currency) {
    state.currency = currency
  },
  setConvertionPayment(state: PaymentsState, convertion) {
    state.convertion = convertion
  },
  setFieldCurrency(state: PaymentsState, currency) {
    state.fieldCurrency = currency
  }
}
