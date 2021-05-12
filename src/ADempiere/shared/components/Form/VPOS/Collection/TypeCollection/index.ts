import { requestGetConversionRate } from '@/ADempiere/modules/core'
import { IFieldData } from '@/ADempiere/modules/field'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { formatDate, formatPrice } from '@/ADempiere/shared/utils/valueFormat'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'TypeCollection',
  mixins: [Template]
})
export default class TypeCollection extends Vue {
    @Prop({ type: Array, default: undefined }) isAddTypePay?: any[]
    @Prop({ type: Object, default: undefined }) listTypesPayment: any
    @Prop({ type: Object, default: undefined }) currency?: any
    @Prop({
      type: Boolean,
      default: false
    }) isLoaded!: boolean

    public conevertion = 0
    public loginCovertion = false
    public labelTypesPayment: any[] = []

    // Computed properties
    get typesPayment() {
      return this.$store.getters[Namespaces.Payments + '/' + 'getListsPaymentTypes']
    }

    get listCurrency() {
      return this.$store.getters[Namespaces.Payments + '/' + 'getListCurrency']
    }

    get conevertionAmount() {
      return this.$store.getters[Namespaces.Payments + '/' + 'getConvertionPayment']
    }

    // Hooks
    created() {
      this.convertingPaymentMethods()
      if (isEmptyValue(this.labelTypesPayment)) {
        this.tenderTypeDisplaye(this.listTypesPayment)
      }
    }

    // Methods
    formatDate = formatDate

    formatPrice = formatPrice

    convertingPaymentMethods() {
      const currencyUuid = this.isAddTypePay!.find(pay => pay.currencyUuid !== this.currency.uuid)
      if (!isEmptyValue(currencyUuid)) {
        requestGetConversionRate({
          conversionTypeUuid: this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS'].conversionTypeUuid,
          currencyFromUuid: this.currency.uuid,
          currencyToUuid: currencyUuid.currencyUuid
        })
          .then(response => {
            this.isAddTypePay!.forEach(element => {
              if (element.currencyUuid !== this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS'].priceList.currency.uuid) {
                element.amountConvertion = element.amount / response.divideRate!
                element.currencyConvertion = response.currencyTo
              } else {
                element.currencyConvertion = {}
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

    tenderTypeDisplaye(value: Partial<IFieldData>) {
      if (!isEmptyValue(value.reference)) {
        const tenderType = value.reference
        if (!isEmptyValue(tenderType)) {
          this.$store.dispatch(Namespaces.Lookup + '/' + 'getLookupListFromServer', {
            tableName: tenderType!.tableName,
            query: tenderType!.query,
            filters: []
          })
            .then(response => {
              this.labelTypesPayment = response
            })
        }
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
