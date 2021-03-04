import { Namespaces } from '@/ADempiere/shared/utils/types'
import { formatDate, formatPrice } from '@/ADempiere/shared/utils/valueFormat'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'TypeCollection',
  mixins: [Template]
})
export default class TypeCollection extends Vue {
    @Prop({ type: Array, default: undefined }) isAddTypePay?: any[] = undefined
    @Prop({ type: Object, default: undefined }) currency?: any = undefined
    public conevertion = 0

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

    // Methods
    formatDate = formatDate

    formatPrice = formatPrice

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

    amountConvertion(payment: any) {
      return payment.aount * this.conevertionAmount.multiplyRate
    }
}
