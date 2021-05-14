import { IConversionRateData } from '@/ADempiere/modules/core'
import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { PaymentsState, IPaymentsData } from '../../POSType'

type PaymentsGetterTree = GetterTree<PaymentsState, IRootState>

export const getters: PaymentsGetterTree = {
  getPaymentBox: (state: PaymentsState): PaymentsState => {
    return state
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
  getListPayments: (state: PaymentsState): {
    payments: IPaymentsData[]
    isLoaded: boolean
  } => {
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
  },
  getFieldCuerrency: (state: PaymentsState) => {
    return state.fieldCurrency
  },
  getConvertionRate: (state: PaymentsState): Partial<IConversionRateData>[] => {
    return state.convertionRate
  }
}
