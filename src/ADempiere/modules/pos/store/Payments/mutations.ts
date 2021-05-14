import { IConversionRateData } from '@/ADempiere/modules/core'
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
  },
  conversionRate(state: PaymentsState, currency: Partial<IConversionRateData>) {
    const listCurrent = state.convertionRate.find(element => {
      if (element.id === currency.id) {
        return element
      }
    })
    if (listCurrent === undefined) {
      state.convertionRate.push(currency)
    }
  },
  resetConversionRate(state: PaymentsState, currency: Partial<IConversionRateData>[]) {
    state.convertionRate = currency
  }
}
