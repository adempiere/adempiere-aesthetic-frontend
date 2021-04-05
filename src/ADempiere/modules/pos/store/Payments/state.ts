import { PaymentsState } from '../../POSType'

export const state: PaymentsState = {
  paymentBox: [],
  multiplyRate: 1,
  divideRate: 1,
  multiplyRateCollection: 1,
  divideRateCollection: 1,
  listPayments: [],
  tenderTypeDisplaye: [
    {
      tenderTypeCode: 0,
      tenderTypeDisplay: ''
    }
  ],
  currency: [],
  convertion: {}
}
