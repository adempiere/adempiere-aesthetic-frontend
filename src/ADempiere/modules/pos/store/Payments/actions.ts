import { IConversionRateData, IGetConversionRateParams, requestGetConversionRate } from '@/ADempiere/modules/core'
import { IRootState } from '@/store'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { ActionContext, ActionTree } from 'vuex'
import { PaymentsState, IPaymentsData } from '../../POSType'
import { createPayment, deletePayment, getPaymentsList, updatePayment } from '../../POSService'
import { IResponseList, Namespaces } from '@/ADempiere/shared/utils/types'

type PaymentsActionContext = ActionContext<PaymentsState, IRootState>
type PaymentsActionTree = ActionTree<PaymentsState, IRootState>

export const actions: PaymentsActionTree = {
  /**
     * creating boxes with the payment list
     */
  setPaymentBox(context: PaymentsActionContext, params: {
    quantityCahs: number
    bankUuid: string
    referenceNo: string
    description: string
    amount: number
    paymentDate: Date
    tenderTypeCode: any
    currencyUuid: string
    }) {
    const { quantityCahs, bankUuid, referenceNo, description, amount, paymentDate, tenderTypeCode, currencyUuid } = params
    const payments = context.getters.getPaymentBox.find((element: any) => {
      if (tenderTypeCode === 'X' && element.currencyUuid === currencyUuid) {
        return element
      }
    })
    if (!payments) {
      context.commit('addPaymentBox', {
        quantityCahs,
        bankUuid,
        referenceNo,
        description,
        amount,
        paymentDate,
        tenderTypeCode,
        currencyUuid
      })
    } else {
      const addPayment = context.getters.getPaymentBox.map((item: any) => {
        if ((item.tenderTypeCode === tenderTypeCode) && item.currencyUuid === params.currencyUuid) {
          return {
            ...item,
            payAmt: item.amount + amount,
            quantityCahs: item.quantityCahs + quantityCahs
          }
        }
        return item
      })
      context.state.paymentBox = addPayment
    }
  },
  deleteCollectBox(context: PaymentsActionContext, key: number) {
    const payment: any[] = context.state.paymentBox
    payment.splice(key, 1)
  },
  deleteAllCollectBox(context: PaymentsActionContext) {
    const payment: any[] = context.state.paymentBox
    payment.splice(0)
  },
  conversionDivideRate(context: PaymentsActionContext, params: IGetConversionRateParams) {
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
  conversionMultiplyRate(context: PaymentsActionContext, payload: IGetConversionRateParams) {
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
  changeMultiplyRate(context: PaymentsActionContext, multiplyRate: number) {
    context.commit('currencyMultiplyRate', multiplyRate)
  },
  changeDivideRate(context: PaymentsActionContext, divideRate: number) {
    context.commit('currencyDivideRate', divideRate)
  },
  createPayments(context: PaymentsActionContext, params: {
    posUuid: string
    orderUuid: string
    invoiceUuid: string
    bankUuid: string
    referenceNo: string
    description: string
    amount: number
    paymentDate: Date
    tenderTypeCode: string
    currencyUuid: string
  }) {
    const { posUuid, orderUuid, invoiceUuid, bankUuid, referenceNo, description, amount, paymentDate, tenderTypeCode, currencyUuid } = params
    const listPayments: IPaymentsData | undefined = context.getters.getListPayments.find((payment: IPaymentsData) => {
      if ((payment.tenderTypeCode === tenderTypeCode) && (payment.tenderTypeCode === 'X') && (currencyUuid === payment.currencyUuid)) {
        return payment
      }
      return undefined
    })
    if (!listPayments) {
      createPayment({
        posUuid,
        orderUuid,
        invoiceUuid,
        bankUuid,
        referenceNo,
        description,
        amount,
        paymentDate,
        tenderTypeCode,
        currencyUuid
      })
        .then(response => {
          const orderUuid = response.order_uuid
          context.dispatch('listPayments', { orderUuid })
        })
        .catch(error => {
          console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    } else {
      updatePayment({
        paymentUuid: listPayments.uuid,
        bankUuid,
        referenceNo,
        description,
        amount: listPayments.amount + amount,
        paymentDate,
        tenderTypeCode
      })
        .then(response => {
          const orderUuid = response.order_uuid
          context.dispatch('listPayments', { orderUuid })
        })
        .catch(error => {
          console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    }
  },
  deletetPayments(context: PaymentsActionContext, params: {
    orderUuid: string
    paymentUuid: string
  }) {
    const { orderUuid, paymentUuid } = params
    deletePayment({
      paymentUuid
    })
      .then(response => {
        context.dispatch('listPayments', { orderUuid })
      })
      .catch(error => {
        console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  },
  listPayments(context: PaymentsActionContext, params: { posUuid: string, orderUuid: string }) {
    context.dispatch(Namespaces.Utils + '/' + 'updatePaymentPos', true, { root: true })
    const { posUuid, orderUuid } = params
    getPaymentsList({
      posUuid,
      orderUuid
    })
      .then((response: IResponseList<IPaymentsData>) => {
        context.commit('setListPayments', response.list)
      })
      .catch(error => {
        console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
      })
      .finally(() => {
        context.dispatch(Namespaces.Utils + '/' + 'updatePaymentPos', false, { root: true })
      })
  },
  tenderTypeDisplaye(context: PaymentsActionContext, tenderType: any[]) {
    const displayTenderType = tenderType.map(item => {
      return {
        tenderTypeCode: item.id,
        tenderTypeDisplay: item.label
      }
    })
    context.commit('setTenderTypeDisplaye', displayTenderType)
  },
  // upload orders to theServer
  uploadOrdersToServer(context: PaymentsActionContext, params: {
    listPaymentsLocal: any[]
    posUuid: string
    orderUuid: string
  }) {
    const { listPaymentsLocal, posUuid, orderUuid } = params
    listPaymentsLocal.forEach(payment => {
      createPayment({
        posUuid,
        orderUuid,
        bankUuid: payment.bankUuid,
        referenceNo: payment.referenceNo,
        description: payment.description,
        amount: payment.amount,
        paymentDate: payment.paymentDate,
        tenderTypeCode: payment.tenderTypeCode,
        currencyUuid: payment.currencyUuid
      })
        .then(response => {
          const orderUuid = response.order_uuid
          context.dispatch(Namespaces.Payments + '/' + 'listPayments', { orderUuid })
        })
        .catch(error => {
          console.warn(`ListPaymentsFromServer: ${error.message}. Code: ${error.code}.`)
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    })
  },
  currencyDisplaye(context: PaymentsActionContext, currency: any[]) {
    const displaycurrency = currency.map(item => {
      return {
        currencyUuid: item.uuid,
        currencyId: item.id,
        currencyDisplay: item.label
      }
    })
    context.commit('setCurrencyDisplaye', displaycurrency)
  },
  convertionPayment(context: PaymentsActionContext, params: {
    conversionTypeUuid: string
    currencyFromUuid: string
    currencyToUuid: string
  }) {
    const { conversionTypeUuid, currencyFromUuid, currencyToUuid } = params
    requestGetConversionRate({
      conversionTypeUuid,
      currencyFromUuid,
      currencyToUuid
    })
      .then(response => {
        context.commit('setConvertionPayment', response)
      })
      .catch(error => {
        console.warn(`ConvertionPayment: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  }
}
