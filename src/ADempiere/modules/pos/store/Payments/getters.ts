import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { PaymentsState, IPaymentsData } from '../../POSType'

type PaymentsGetterTree = GetterTree<PaymentsState, IRootState>

export const getters: PaymentsGetterTree = {
  getPaymentBox: (state: PaymentsState): any[] => {
    return state.paymentBox
  },
  getMultiplyRate: (state: PaymentsState): number => {
    return state.multiplyRate
  },
  getDivideRate: (state: PaymentsState): number => {
    return state.divideRate
  },
  getMultiplyRateCollection: (state: PaymentsState): number => {
    return state.multiplyRateCollection
  },
  getDivideRateCollection: (state: PaymentsState): number => {
    return state.divideRateCollection
  },
  getListPayments: (state: PaymentsState): IPaymentsData[] => {
    console.log(state.listPayments)
    return state.listPayments
  },
  getListsPaymentTypes: (state: PaymentsState): any[] => {
    return state.tenderTypeDisplaye
  },
  getListCurrency: (state: PaymentsState) => {
    return state.currency
  },
  getConvertionPayment: (state: PaymentsState) => {
    return state.convertion
  }
}
