import { IConversionRateData, ICurrencyData } from '@/ADempiere/modules/core'
import { ICurrentOrderData, IOrderData, IPaymentsData, IPointOfSalesData, processOrder } from '@/ADempiere/modules/pos'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { formatDate, formatPrice } from '@/ADempiere/shared/utils/valueFormat'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { IFieldLocation } from '../../../Field/FieldLocation/fieldList'
import MixinPOS from '../MixinPOS'
import ConvertAmount from './ConvertAmount'
import fieldListCollection from './fieldListCollection'
import Template from './template.vue'
import TypeCollection from './TypeCollection'
import { FIELDS_DECIMALS } from '@/ADempiere/shared/utils/references'

@Component({
  name: 'Collection',
  components: {
    TypeCollection,
    ConvertAmount
  },
  mixins: [MixinPOS, Template]
})
export default class Collection extends Mixins(MixinPOS) {
    @Prop({ type: Boolean, required: false }) isLoadedPanel!: boolean
    @Prop({ type: Object, default: undefined }) amount?: any
    @Prop({
      type: Object,
      default: () => {
        return {
          uuid: 'Collection',
          containerUuid: 'Collection'
        }
      }
    }) metadata: any

    public isCustomForm = true
    public checked = false
    public currencyConversion = 1
    public convertAllPayment = 1
    public allPayCurrency = 0
    public labelTenderType = ''
    public defaultLabel = ''
    fieldsList = fieldListCollection
    public sendToServer = false
    amontSend= 0

    // Computed properties
    get validateCompleteCollection(): boolean {
      let collection: boolean
      const validation = this.pay >= this.currentOrder.grandTotal! && (this.isCashAmt >= this.change)

      if (this.pay === this.currentOrder.grandTotal!) {
        collection = false
      } else if (validation || this.checked) {
        collection = false
      } else {
        collection = true
      }
      return collection
    }

    get fullCopper(): boolean {
      if ((this.change > this.isCashAmt) && this.pay > this.currentOrder.grandTotal!) {
        return true
      }
      return false
    }

    get isPaymentBox(): any[] {
      return this.$store.getters[Namespaces.Payments + '/' + 'getPaymentBox']
    }

    get addPay(): boolean {
      const amount = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid: this.containerUuid,
        columnName: 'PayAmt'
      })
      if (amount <= 0) {
        return true
      }
      return false
    }

    get listPayments(): IPaymentsData[] {
      const listLocal = this.$store.getters[Namespaces.Payments + '/' + 'getPaymentBox']
      const listServer = this.currentOrder.listPayments!
      if (!this.sendToServer) {
        return listServer.payments
      }
      return listLocal
    }

    get isLoadedPayments(): boolean {
      return this.currentOrder.listPayments!.isLoaded!
    }

    get paymentBox(): any[] {
      const payment = this.listPayments.filter((pay: any) => {
        return pay.isVisible
      })
      if (!payment) {
        return []
      }
      return payment
    }

    get cashPayment() {
      const cash = this.listPayments.filter(pay => {
        return pay.tenderTypeCode === 'X'
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
      const cash = this.isMandatory
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
        if (allPay <= this.currentOrder.grandTotal!) {
          return false
        }
        return true
      }
      return false
    }

    get isCashAmt(): number {
      const cashAmt: number[] = this.listPayments.map(item => {
        if (item.tenderTypeCode === 'X') {
          return item.amount
        }
        return 0
      })
      if (cashAmt && cashAmt.length) {
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
      return this.sumCash(this.listPayments)
    }

    get pending(): number {
      const missing = this.currentOrder.grandTotal! - this.pay
      if (this.pay > 0 && this.pay < this.currentOrder.grandTotal!) {
        return missing
      }
      const pending = this.currentOrder.grandTotal! <= this.pay ? 0 : this.currentOrder.grandTotal!
      return pending
    }

    get convertion(): number {
      return this.$store.getters[Namespaces.Payments + '/' + 'getDivideRateCollection']
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

    get validPay(): boolean {
      const containerUuid = this.containerUuid
      // filter by visible fields
      const fieldLogic = this.fieldsList.filter(field => field.isDisplayedFromLogic === true)
      const fieldsEmpty: string[] = this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListEmptyMandatory']({
        containerUuid,
        fieldsList: fieldLogic,
        isValidate: true
      })
      return !!(fieldsEmpty.length)
    }

    get change(): number {
      const missing = this.pay - this.currentOrder.grandTotal!
      if (this.pay > 0 && this.pay > this.currentOrder.grandTotal!) {
        return missing
      }
      return 0
    }

    get displayCurrency(): any[] {
      return this.$store.getters[Namespaces.Payments + '/' + 'getListCurrency']
    }

    get convert() {
      return this.$store.getters[Namespaces.Payments + '/' + 'getConvertionPayment']
    }

    get updateOrderPaymentPos(): boolean {
      return this.$store.getters[Namespaces.Utils + '/' + 'getUpdatePaymentPos']
    }

    get dateRate(): Partial<IConversionRateData> | undefined {
      const convertionRate = this.$store.getters[Namespaces.Payments + '/' + 'getConvertionRate'] as Partial<IConversionRateData>[]
      return convertionRate.find(currency => {
        if (currency.id === this.typeCurrency) {
          return currency
        }
      })
    }

    get typeCurrency() {
      return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID'
      })
    }

    get currencyUuid(): string {
      return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid: 'Collection',
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
      return this.$store.getters[Namespaces.Payments + '/' + 'getMultiplyRate']
    }

    get multiplyRateCollection() {
      return this.$store.getters[Namespaces.Payments + '/' + 'getMultiplyRateCollection']
    }

    get divideRate(): number {
      return this.$store.getters[Namespaces.Payments + '/' + 'getDivideRate']
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

    // Watchers
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
      const convertionRate = this.$store.getters[Namespaces.Payments + '/' + 'getConvertionRate'] as Partial<IConversionRateData>[]
      const alo = convertionRate.find(currency => {
        if (currency.uuid === value) {
          return currency
        }
      })
      if (alo === undefined) {
        this.$store.dispatch(Namespaces.Payments + '/' + 'conversionDivideRate', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.pointOfSalesCurrency.uuid,
          currencyToUuid: value
        })
      }
    }

    @Watch('convertAllPayment')
    handleConvertAllPaymentChange(value: number) {
      if (!isEmptyValue(value)) {
        this.allPayCurrency = this.pay / value
      }
      this.allPayCurrency = this.pay
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

    @Watch('dateRate')
    handleDateRateChange(value: any) {
      if (value && !isEmptyValue(value.amountConvertion)) {
        this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.pending / value.amountConvertion
        })
      } else {
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

    formatNumber(params: { displayType: number, number: number }) {
      const { number, displayType } = params
      let fixed = 0
      // Amount, Costs+Prices, Number
      if (FIELDS_DECIMALS.includes(displayType)) {
        fixed = 2
      }
      return new Intl.NumberFormat().format(Number(number.toFixed(fixed)))
    }

    sumCash(cash: any[]) {
      let sum = 0
      if (cash) {
        cash.forEach((pay) => {
          sum += pay.amount
        })
      }
      return sum
    }

    notSubmitForm(event: any) {
      event.preventDefault()
      return false
    }

    // displayTenderType(type: string) {
    //   let label = ''
    //   switch (type) {
    //     case 'A':
    //       label = 'Depósito directo'
    //       break
    //     case 'C':
    //       label = 'Tarjeta de crédito'
    //       break
    //     case 'D':
    //       label = 'Débito directo'
    //       break
    //     case 'K':
    //       label = 'Cheque'
    //       break
    //     case 'M':
    //       label = 'Nota de crédito'
    //       break
    //     case 'P':
    //       label = 'Pago móvil interbancario'
    //       break
    //     case 'T':
    //       label = 'Cuenta'
    //       break
    //     case 'X':
    //       label = 'Efectivo'
    //       break
    //     case 'Z':
    //       label = 'Zelle'
    //       break
    //   }
    //   return label
    // }

    addCollectToList(): void {
      const containerUuid = this.containerUuid
      const posUuid: string = this.currentPointOfSales.uuid!
      const orderUuid = this.$route.query.action
      const bankUuid = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'C_Bank_ID_UUID'
      })
      this.amontSend = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'PayAmt'
      })
      const paymentDate = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'DateTrx'
      })
      const tenderTypeCode = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'TenderType'
      })
      const referenceNo = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'ReferenceNo'
      })
      const currencyUuid = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'C_Currency_ID_UUID'
      })
      const currencyId = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid,
        columnName: 'C_Currency_ID'
      })
      const currencyToPay = isEmptyValue(currencyUuid) ? currencyId : currencyUuid
      if (isEmptyValue(this.currencyDisplay(currencyToPay)) && this.currencyDisplay(currencyToPay).currencyUuid !== this.pointOfSalesCurrency.uuid) {
        this.amontSend = this.convert.divideRate * this.amontSend
      }

      if (this.sendToServer) {
        this.$store.dispatch(Namespaces.Payments + '/' + 'setPaymentBox', {
          posUuid,
          orderUuid,
          bankUuid,
          referenceNo,
          amount: this.amontSend * this.convertion,
          paymentDate,
          tenderTypeCode,
          currencyUuid
        })
      } else {
        this.$store.dispatch(Namespaces.Payments + '/' + 'createPayments', {
          posUuid,
          orderUuid,
          bankUuid,
          referenceNo,
          amount: this.amontSend * this.convertion,
          paymentDate,
          tenderTypeCode,
          currencyUuid: this.currencyDisplay(currencyToPay)
        })
      }
      this.addCollect()
    }

    updateServer(listPaymentsLocal: any) {
      // const listLocal = this.$store.getters.getPaymentBox
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.$route.query.action
      this.$store.dispatch('uploadOrdersToServer', { listPaymentsLocal, posUuid, orderUuid })
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
          value: this.pointOfSalesCurrency.id
        })
        this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
          parentUuid: '',
          containerUuid: 'Collection',
          columnName: 'DisplayColumn_TenderType',
          value: this.defaultLabel
        })
        this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.pending
        })
      })
      this.defaultValueCurrency()
      this.$store.commit(Namespaces.Payments + '/' + 'currencyDivideRateCollection', 1)
      this.$store.dispatch(Namespaces.Payments + '/' + 'currencyMultiplyRate', 1)
      this.cancel()
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
        value: this.pointOfSalesCurrency.id
      })
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'PayAmt',
        value: this.pending
      })
      this.defaultValueCurrency()
      this.$store.commit(Namespaces.Payments + '/' + 'currencyDivideRateCollection', 1)
      this.$store.commit(Namespaces.Payments + '/' + 'currencyMultiplyRate', 1)
    }

    exit() {
      this.$store.commit(Namespaces.PointOfSales + '/' + 'setShowPOSCollection', false)
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
        value: this.pointOfSalesCurrency.iSOCode
      })
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID',
        value: this.pointOfSalesCurrency.id
      })
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID_UUID',
        value: this.pointOfSalesCurrency.uuid
      })
    }

    defaulTenderType(): void {
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        parentUuid: '',
        containerUuid: 'Collection',
        columnName: 'DisplayColumn_TenderType',
        value: this.$t('form.pos.collect.TenderType.cash')
      })
    }

    currencyDisplay(currency: any) {
      const display = this.displayCurrency.find(item => {
        if (item.currencyUuid === currency || (item.currencyId === currency)) {
          return item
        }
      })
      if (display) {
        return display
      }
      if (currency === this.pointOfSalesCurrency.id) {
        return this.pointOfSalesCurrency.uuid
      }

      return currency
    }

    convertCurrency() {
      const convertCurrency = this.currencyDisplay(100)
      this.$store.dispatch(Namespaces.Payments + '/' + 'convertionPayment', {
        conversionTypeUuid: this.currentPointOfSales,
        currencyFromUuid: this.pointOfSalesCurrency.uuid,
        currencyToUuid: convertCurrency.currencyUuid
      })
    }

    undoPatment() {
      const list = this.listPayments[this.listPayments.length - 1]
      const orderUuid = list.orderUuid
      const paymentUuid = list.uuid
      this.$store.dispatch(Namespaces.Payments + '/' + 'deletetPayments', {
        orderUuid,
        paymentUuid
      })
    }

    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === Namespaces.FieldValue + '/' + 'updateValueOfField') {
          if (mutation.payload.columnName === 'DisplayColumn_TenderType') {
            this.labelTenderType = mutation.payload.value
          }
        }
      })
    }

    completePreparedOrder(payment: any) {
      const posUuid: string = this.currentPointOfSales.uuid!
      const orderUuid: string = this.$route.query.action as string
      this.$store.dispatch(Namespaces.Utils + '/' + 'updateOrderPos', true)
      this.$store.dispatch(Namespaces.Utils + '/' + 'updatePaymentPos', true)
      this.$message({
        type: 'info',
        message: this.$t('notifications.processing').toString(),
        showClose: true
      })
      processOrder({
        posUuid,
        orderUuid,
        createPayments: Boolean(payment),
        payments: payment
      })
        .then(response => {
          this.$store.dispatch(Namespaces.Order + '/' + 'reloadOrder', response.uuid)
          this.$message({
            type: 'success',
            message: this.$t('notifications.completed').toString(),
            showClose: true
          })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
          console.log(error)
        })
        .finally(() => {
          this.$store.dispatch(Namespaces.Order + '/' + 'listOrdersFromServer', {
            posUuid: this.currentPointOfSales.uuid
          })
          this.$store.dispatch(Namespaces.Utils + '/' + 'updateOrderPos', false)
          this.$store.dispatch(Namespaces.Utils + '/' + 'updatePaymentPos', false)
        })
    }

    // Hooks
    created() {
      console.log(this.$store.getters.getConvertionRate)
      this.$store.dispatch(Namespaces.Payments + '/' + 'addRateConvertion', this.pointOfSalesCurrency)
      this.unsubscribe = this.subscribeChanges()
      this.defaultValueCurrency()
    }
}
