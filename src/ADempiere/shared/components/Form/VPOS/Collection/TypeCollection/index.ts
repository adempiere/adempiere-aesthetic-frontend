import { IConversionRateData, requestGetConversionRate } from '@/ADempiere/modules/core'
import { IPaymentsData, IPOSAttributesData } from '@/ADempiere/modules/pos'
import { IFieldLocation } from '@/ADempiere/shared/components/Field/FieldLocation/fieldList'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { formatDate, formatPrice } from '@/ADempiere/shared/utils/valueFormat'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import MixinPOS from '../../MixinPOS'
import Template from './template.vue'

@Component({
  name: 'TypeCollection',
  mixins: [Template, MixinPOS]
})
export default class TypeCollection extends Mixins(MixinPOS) {
  @Prop({ type: Array, default: undefined }) isAddTypePay?: any[]
  @Prop({ type: Boolean, default: false }) openPanel!: boolean
  @Prop({ type: Object, default: undefined }) listTypesPayment: any
  @Prop({ type: Object, default: undefined }) currency?: any
  @Prop({ type: Object, default: undefined }) listPaymentType?: IFieldLocation

  public conevertion = 0
  public loginCovertion = false
  public labelTypesPayment: any[] | Partial<IFieldLocation> = []

  // Computed properties
  get typesPayment() {
    return this.$store.getters[
      Namespaces.Payments + '/' + 'getListsPaymentTypes'
    ]
  }

  get listCurrency() {
    return this.$store.getters[Namespaces.Payments + '/' + 'getListCurrency']
  }

  get conevertionAmount() {
    return this.$store.getters[
      Namespaces.Payments + '/' + 'getConvertionPayment'
    ]
  }

  // Validate if there is a payment in a different type of currency to the point
  get paymentCurrency(): IPaymentsData | undefined {
    return (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales.currentOrder.listPayments.payments.find(pay => pay.currencyUuid !== this.currency.uuid)
  }

  // Hooks
  created() {
    this.convertingPaymentMethods()
    if (isEmptyValue((this.labelTypesPayment as IFieldLocation).reference) && !isEmptyValue(this.listPaymentType?.reference)) {
      this.tenderTypeDisplaye({
        tableName: this.listPaymentType!.reference.tableName,
        query: this.listPaymentType!.reference.query
      })
    }
  }

  // Watchers
  @Watch('listPaymentType')
  handleListPaymentTypeChange(value: IFieldLocation) {
    if (!isEmptyValue(value.reference)) {
      this.tenderTypeDisplaye({
        tableName: value.reference.tableName,
        query: value.reference.query
      })
    }
  }

  // Methods
  formatDate = formatDate

  formatPrice = formatPrice

  // If there are payments in another currency, search for conversion
  convertingPaymentMethods() {
    if (!isEmptyValue(this.paymentCurrency)) {
      requestGetConversionRate({
        conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid!,
        currencyFromUuid: this.currency.uuid,
        currencyToUuid: this.paymentCurrency!.currencyUuid
      })
        .then(response => {
          return (response as IConversionRateData)
        })
        .then((response: IConversionRateData) => {
          (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales
            .currentOrder.listPayments.payments.forEach((element: IPaymentsData) => {
              if (element.currencyUuid !== this.pointOfSalesCurrency.uuid) {
                element.multiplyRate = element.amount / response.multiplyRate
                element.amountConvertion = element.multiplyRate / response.divideRate
                element.divideRate = response.multiplyRate
                element.currencyConvertion = response.currencyTo
              }
            })
          this.$store.commit(Namespaces.Payments + '/' + 'setListPayments', {
            payments: this.isAddTypePay
          })
        })
        .catch(error => {
          console.warn(`conversion: ${error.message}. Code: ${error.code}.`)
        })
    }
    this.loginCovertion = true
  }

  // Payment card label
  tenderTypeDisplaye(value: { tableName: string, query: string }) {
    const { tableName, query } = value
    if (!isEmptyValue(tableName)) {
      this.$store
        .dispatch(Namespaces.Lookup + '/' + 'getLookupListFromServer', {
          tableName,
          query
        })
        .then(response => {
          this.labelTypesPayment = response
        })
    }
  }

  getImageFromTenderType(typePay: string): any {
    // A: Direct Deposit: ACH Automatic Clearing House
    // C: Credit Card:
    // D: Direct Debit:
    // K: Check:
    // M: Credit Memo:
    // P: Mobile Payment Interbank:
    // T: Account:
    // X: Cash:
    // Z: Zelle:
    let image = ''
    switch (typePay) {
      case 'A':
        image = 'DirectDeposit2'
        break
      case 'M':
        image = 'CreditMemo'
        break
      case 'K':
        image = 'check2'
        break
      case 'X':
        image = 'cash'
        break
      case 'Z':
        image = 'zelle'
        break
      case 'T':
        image = 'Account'
        break
      case 'P':
        image = 'paymobile'
        break
      case 'C':
        image = 'CreditCard'
        break
      case 'D':
        image = 'DirectDebit'
        break
    }
    return require('@/image/' + image + '.jpg')
  }

  deleteCollect(key: any): void {
    const orderUuid: string = key.orderUuid
    const paymentUuid: string = key.uuid
    this.$store.dispatch(Namespaces.Payments + '/' + 'deletetPayments', {
      orderUuid,
      paymentUuid
    })
  }
}
