import { IConversionRateData, ICurrencyData, IGetConversionRateParams, requestGetConversionRate } from '@/ADempiere/modules/core'
import { IRootState } from '@/store'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { ActionContext, ActionTree } from 'vuex'
import { CollectionState } from '../../POSType'

type CollectionActionContext = ActionContext<CollectionState, IRootState>
type CollectionActionTree = ActionTree<CollectionState, IRootState>

export const actions: CollectionActionTree = {
  /**
     * creating boxes with the payment list
     */
  setPaymentBox(context: CollectionActionContext, params: {
        tenderType: any
        currency: ICurrencyData
        payAmt: number
        quantityCahs: number
    }) {
    const payments = context.getters.getPaymentBox.find((element: any) => {
      if (params.tenderType === 'X' && element.currency.id === params.currency.id) {
        return element
      }
    })
    if (!payments) {
      context.commit('addPaymentBox', params)
    } else {
      const addPayment = context.getters.getPaymentBox.map((item: any) => {
        if ((item.tenderType === params.tenderType) && item.currency.id === params.currency.id) {
          return {
            ...item,
            payAmt: item.payAmt + params.payAmt,
            quantityCahs: item.quantityCahs + params.quantityCahs
          }
        }
        return item
      })
      context.state.paymentBox = addPayment
    }
  },
  deleteCollectBox(context: CollectionActionContext, key: number) {
    const payment: any[] = context.state.paymentBox
    payment.splice(key, 1)
  },
  deleteAllCollectBox(context: CollectionActionContext) {
    const payment: any[] = context.state.paymentBox
    payment.splice(0)
  },
  conversionDivideRate(context: CollectionActionContext, params: IGetConversionRateParams) {
    requestGetConversionRate({
      conversionTypeUuid: params.conversionTypeUuid,
      currencyFromUuid: params.currencyFromUuid,
      currencyToUuid: params.currencyToUuid
    })
      .then((response: IConversionRateData | Partial<IConversionRateData>) => {
        const divideRate: number = (!response.divideRate) ? 1 : response.divideRate
        if (params.containerUuid === 'Collection') {
          context.commit('currencyDivideRateCollection', divideRate)
        } else {
          context.commit('currencyDivideRate', divideRate)
        }
        context.commit('currencyDivideRate', divideRate)
      })
      .catch(error => {
        console.warn(`conversionDivideRate: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  conversionMultiplyRate(context: CollectionActionContext, payload: IGetConversionRateParams) {
    const {
      conversionTypeUuid,
      currencyFromUuid,
      currencyToUuid,
      containerUuid
      // conversionDate
    } = payload
    requestGetConversionRate({
      containerUuid,
      conversionTypeUuid,
      currencyFromUuid,
      currencyToUuid
      // conversionDate
    })
      .then((response: IConversionRateData| Partial<IConversionRateData>) => {
        const multiplyRate: number = (!response.multiplyRate) ? 0 : response.multiplyRate
        if (containerUuid === 'Collection') {
          context.commit('currencyMultiplyRateCollection', multiplyRate)
        } else {
          context.commit('currencyMultiplyRate', multiplyRate)
        }
      })
      .catch(error => {
        console.warn(`conversionMultiplyRate: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  changeMultiplyRate(context: CollectionActionContext, multiplyRate: number) {
    context.commit('currencyMultiplyRate', multiplyRate)
  },
  changeDivideRate(context: CollectionActionContext, divideRate: number) {
    context.commit('currencyDivideRate', divideRate)
  }
}
