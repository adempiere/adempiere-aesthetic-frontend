import { ICurrencyData } from '@/ADempiere/modules/core'
import { IOrderData, IPointOfSalesData } from '@/ADempiere/modules/pos'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { formatDate, formatPrice } from '@/ADempiere/shared/utils/valueFormat'
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { IFieldLocation } from '../../../Field/FieldLocation/fieldList'
import MixinForm from '../../MixinForm'
import ConvertAmount from './ConvertAmount'
import fieldListCollection from './fieldListCollection'
import Template from './template.vue'
import TypeCollection from './TypeCollection'

@Component({
  name: 'Collection',
  components: {
    TypeCollection,
    ConvertAmount
  },
  mixins: [MixinForm, Template]
})
export default class Collection extends Mixins(MixinForm) {
    @Prop({ type: Boolean, required: false }) isLoadedPanel!: boolean
    @Prop({ type: Object, default: undefined }) amount?: any = undefined
    @Prop({
      type: Object,
      default: {
        uuid: 'Collection',
        containerUuid: 'Collection'
      }
    }) metadata: any = {
      uuid: 'Collection',
      containerUuid: 'Collection'
    }

    public isCustomForm = true
    public currencyConversion = 1
    public convertAllPayment = 1
    public allPayCurrency = 0
    fieldsList = fieldListCollection

    // Computed properties
    get isPaymentBox(): any[] {
      return this.$store.getters[Namespaces.Collection + '/' + 'getPaymentBox']
    }

    get paymentBox(): any[] {
      const payment = this.isPaymentBox.filter((pay: any) => {
        return pay.isVisible
      })
      if (!payment) {
        return []
      }
      return payment
    }

    get cashPayment() {
      const cash: any[] = this.isPaymentBox.filter(pay => {
        return pay.tenderType === 'X'
      })
      return this.sumCash(cash)
    }

    get isValidForPay(): boolean {
      const containerUuid = this.containerUuid
      const typePay = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'TenderType'
      })
      const amount = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'PayAmt'
      })
      const allChangePrev: number = Number.parseFloat(String(amount + this.change)) - this.cashPayment
      const allChange = Number(allChangePrev.toFixed(2))

      if (typePay !== 'X' && !this.isMandatory) {
        const validateCash = this.cashPayment === this.change && this.pending === 0
        const validateAllChange = (allChange > 0 && this.pending === 0)

        if (validateCash || validateAllChange) {
          return true
        }
        return false
      }
      const cash = this.pending === 0 ? true : this.isMandatory
      return cash
    }

    get turned(): boolean {
      const containerUuid: string = this.containerUuid
      const amount = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'PayAmt'
      })
      const typePay = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'TenderType'
      })
      const allPay = this.cashPayment + amount
      if (typePay !== 'X') {
        if (allPay <= this.order.grandTotal) {
          return false
        }
        return true
      }
      return false
    }

    get isCashAmt(): any[] | 0 {
      const cashAmt: any[] = this.paymentBox.map(item => {
        if (item.tenderType === 'X') {
          return item.payAmt
        }
        return 0
      })
      if (cashAmt) {
        return cashAmt.reduce((accumulator, currentValue) => accumulator + currentValue)
      }
      return 0
    }

    get isOtherPayAmt(): any[] | 0 {
      const cashAmt: any[] = this.paymentBox.map(item => {
        if (item.tenderType !== 'X') {
          return item.payAmt
        }
        return 0
      })
      if (cashAmt) {
        return cashAmt.reduce((accumulator, currentValue) => accumulator + currentValue)
      }
      return 0
    }

    get pay(): number {
      return this.sumCash(this.isPaymentBox)
    }

    get pending(): number {
      const missing = this.order.grandTotal - this.pay
      if (this.pay > 0 && this.pay < this.order.grandTotal) {
        return missing
      }
      const pending = this.order.grandTotal <= this.pay ? 0 : this.order.grandTotal
      return pending
    }

    get isMandatory(): boolean {
      const containerUuid = this.containerUuid
      const fieldsEmpty: string[] = this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListEmptyMandatory']({
        containerUuid,
        fieldsList: this.fieldsList
      })
      const amount = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'PayAmt'
      })
      if (!fieldsEmpty && amount > 0) {
        return false
      }
      return true
    }

    get change(): number {
      const missing = this.pay - this.order.grandTotal
      if (this.pay > 0 && this.pay > this.order.grandTotal) {
        return missing
      }
      return 0
    }

    get order(): IOrderData {
      return this.$store.getters[Namespaces.Order + '/' + 'getFindOrder']
    }

    get currencyPoint(): ICurrencyData | Partial<ICurrencyData> {
      const currency: IPointOfSalesData | undefined = this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS']
      if (currency) {
        return currency.priceList.currency
      }
      return {
        uuid: '',
        iSOCode: '',
        curSymbol: '',
        id: 0
      }
    }

    get currentOrder(): IOrderData | undefined {
      return this.$store.getters[Namespaces.Order + '/' + 'getFindOrder']
    }

    get typeCurrency() {
      return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID'
      })
    }

    get currencyUuid(): string {
      return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID_UUID'
      })
    }

    get displayeTypeCurrency() {
      return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid: this.containerUuid,
        columnName: 'DisplayColumn_C_Currency_ID'
      })
    }

    get multiplyRate(): number {
      return this.$store.getters[Namespaces.Collection + '/' + 'getMultiplyRate']
    }

    get converCurrency() {
      return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid: 'Collection-Convert-Amount',
        columnName: 'C_Currency_ID_UUID'
      })
    }

    get divideRate(): number {
      return this.$store.getters[Namespaces.Collection + '/' + 'getDivideRate']
    }

    get fieldAmount() {
      const amount = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid: this.containerUuid,
        columnName: 'PayAmt'
      })
      return amount * this.divideRate
    }

    get validateConvertion() {
      if (this.fieldAmount <= this.pending) {
        return false
      }
      return true
    }
    // fieldpending() {
    //   return this.pending / this.divideRate
    // }

    // Watchers
    // fieldpending(value) {
    //   this.$store.commit('updateValueOfField', {
    //     containerUuid: this.containerUuid,
    //     columnName: 'PayAmt',
    //     value: value
    //   })
    // },
    @Watch('pending')
    handlePendingChange(value: number) {
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'PayAmt',
        value
      })
    }

    @Watch('currencyUuid')
    handleCurrencyUuidChange(value: string) {
      if (value) {
        this.$store.dispatch(Namespaces.Collection + '/' + 'conversionDivideRate', {
          conversionTypeUuid: this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS'].conversionTypeUuid,
          currencyFromUuid: this.currencyPoint.uuid,
          currencyToUuid: value,
          conversionDate: this.currentOrder!.dateOrdered
        })
      }
    }

      @Watch('convertAllPayment')
    handleConvertAllPaymentChange(value: number) {
      if (value) {
        this.allPayCurrency = this.pay / value
      }
      this.allPayCurrency = this.pay
    }

      @Watch('converCurrency')
      handleConverCurrencyChange(value: any) {
        if (value) {
          this.$store.dispatch(Namespaces.Collection + '/' + 'conversionMultiplyRate', {
            conversionTypeUuid: this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS'].conversionTypeUuid,
            currencyFromUuid: this.currencyPoint.uuid,
            currencyToUuid: value,
            conversionDate: this.currentOrder!.dateOrdered
          })
        } else {
          this.$store.commit(Namespaces.Collection + '/' + 'currencyMultiplyRate', 1)
        }
      }

      @Watch('isLoaded')
      handleIsLoadedChange(value: boolean) {
        if (value) {
          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: 'PayAmt',
            value: this.pending
          })
        }
      }

      // Methods
    formatDate = formatDate

    formatPrice = formatPrice

    sumCash(cash: any[]) {
      let sum = 0
      cash.forEach((pay) => {
        sum += pay.payAmt
      })
      return sum
    }

    notSubmitForm(event: any) {
      event.preventDefault()
      return false
    }

    displayTenderType(type: string) {
      let label = ''
      switch (type) {
        case 'A':
          label = 'Depósito directo'
          break
        case 'C':
          label = 'Tarjeta de crédito'
          break
        case 'D':
          label = 'Débito directo'
          break
        case 'K':
          label = 'Cheque'
          break
        case 'M':
          label = 'Nota de crédito'
          break
        case 'P':
          label = 'Pago móvil interbancario'
          break
        case 'T':
          label = 'Cuenta'
          break
        case 'X':
          label = 'Efectivo'
          break
        case 'Z':
          label = 'Zelle'
          break
      }
      return label
    }

    addCollectToList(): void {
      const containerUuid = this.containerUuid
      const amount = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'PayAmt'
      })
      const date = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'DateTrx'
      })
      const typePay = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'TenderType'
      })
      const referenceNo = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'ReferenceNo'
      })
      let currency = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'DisplayColumn_C_Currency_ID'
      })
      const currencyId = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'C_Currency_ID'
      })
      if (currency === this.currencyPoint.id) {
        currency = this.currencyPoint.iSOCode
      }

      const displayType: string = this.displayTenderType(typePay)
      this.$store.dispatch(Namespaces.Collection + '/' + 'setPaymentBox', {
        isVisible: true,
        quantityCahs: amount,
        payAmt: amount * this.divideRate,
        tenderType: typePay,
        referenceNo: referenceNo,
        dateTrx: date,
        currency: {
          currency,
          id: currencyId
        },
        displayTenderType: displayType
      })
      this.addCollect()
    }

    addCollect(): void {
      this.fieldsList.forEach((element: IFieldLocation) => {
        if (element.columnName !== 'PayAmt') {
          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: element.columnName,
            value: element.overwriteDefinition.defaultValue
          })

          // set default logics
          this.$store.dispatch(Namespaces.Panel + '/' + 'changeDependentFieldsList', {
            field: element
          })
        }
        this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'C_Currency_ID',
          value: this.currencyPoint.id
        })
        this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.pending
        })
      })
      this.defaultValueCurrency()
      this.$store.dispatch(Namespaces.Collection + '/' + 'conversionDivideRate', 1)
    }

    cancel() {
      this.fieldsList.forEach((element) => {
        if (element.columnName !== 'PayAmt' && element.columnName !== 'C_Currency_ID') {
          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: element.columnName,
            value: element.overwriteDefinition.defaultValue
          })
        }
        this.$store.dispatch(Namespaces.Panel + '/' + 'changeDependentFieldsList', {
          field: element
        })
      })
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID',
        value: this.currencyPoint.id
      })
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'PayAmt',
        value: this.pending
      })
      this.defaultValueCurrency()
      this.$store.dispatch(Namespaces.Collection + '/' + 'conversionDivideRate', 1)
    }

    getPriceApplyingDiscount(price?: number, discount?: number): number {
      if (!price) {
        price = 0
      }
      if (!discount) {
        discount = 0
      }
      return price - discount * price / 100
    }

    getDiscountByPriceEntered(unitPrice: number, priceEntereded: number): number {
      if (!unitPrice) {
        unitPrice = 0
      }
      if (!priceEntereded) {
        priceEntereded = 0
      }
      const discount: number = 100 - priceEntereded * 100 / unitPrice
      if (!discount || discount === -Infinity) {
        return 0
      }
      return discount
    }

    defaultValueCurrency(): void {
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'DisplayColumn_C_Currency_ID',
        value: this.currencyPoint.iSOCode
      })
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID',
        value: this.currencyPoint.id
      })
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID_UUID',
        value: this.currencyPoint.uuid
      })
    }

    // Hooks
    created() {
      this.defaultValueCurrency()
    }
}
