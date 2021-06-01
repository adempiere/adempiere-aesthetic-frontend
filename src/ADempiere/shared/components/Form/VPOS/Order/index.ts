import { Component, Mixins } from 'vue-property-decorator'
import BusinessPartner from '@/ADempiere/shared/components/Form/VPOS/BusinessPartner'
import ProductInfo from '@/ADempiere/shared/components/Form/VPOS/ProductInfo'
import MixinOrderLine from './MixinOrderLine'
import fieldListOrders from './fieldListOrders'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import ConvertAmount from '@/ADempiere/shared/components/Form/VPOS/Collection/ConvertAmount/index'
import Template from './template.vue'
import FieldLine from '@/ADempiere/shared/components/Form/VPOS/Order/Line'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { ICurrentOrderData, ICurrentPointOfSalesData, IOrderLineDataExtended, IPOSAttributesData } from '@/ADempiere/modules/pos'
import { ICurrencyData } from '@/ADempiere/modules/core'

@Component({
  name: 'Order',
  mixins: [MixinOrderLine, Template],
  components: {
    BusinessPartner,
    ProductInfo,
    ConvertAmount,
    FieldLine
  }
})
export default class Order extends Mixins(MixinOrderLine) {
  fieldsList = fieldListOrders
  // fieldsList = fieldListOrders
  public seeConversion = false
  private showFieldLine = false

  // Computed properties
  beforeMount() {
    this.fieldsList = fieldListOrders
  }

  created() {
    if (!isEmptyValue(this.$route.query.action)) {
      this.$store.dispatch(Namespaces.Order + '/' + 'reloadOrder', {
        orderUuid: this.$route.query.action
      })
    }
    console.log('orderLineDefinition Order')
    console.log(this.orderLineDefinition)
  }

  get labelButtonCollections() {
    return this.isDisabled ? this.$t('form.pos.order.collections') : this.$t('form.pos.order.collect')
  }

  get shortsKey() {
    return {
      popoverConvet: ['ctrl', 'x']
    }
  }

  get currentPointOfSales() {
    return (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales
  }

  // Currency Point Of Sales
  get pointOfSalesCurrency(): Partial<ICurrencyData> {
    // const currency = this.currentPointOfSales
    if (!isEmptyValue(this.currentPointOfSales.priceList)) {
      return {
        ...this.currentPointOfSales.priceList!.currency,
        amountConvertion: 1
      }
    }
    return {
      uuid: '',
      iSOCode: '',
      curSymbol: '',
      amountConvertion: 1
    }
  }

  get listPontOfSales() {
    return (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).listPointOfSales
  }

  get ordersList() {
    if (isEmptyValue(this.currentPointOfSales)) {
      return []
    }
    return this.currentPointOfSales.listOrder
  }

  get currentOrder(): Partial<ICurrentOrderData> {
    if (isEmptyValue(this.currentPointOfSales)) {
      return {
        documentType: {
          description: '',
          id: 0,
          name: '',
          printName: '',
          uuid: ''
        },
        documentStatus: {
          description: '',
          name: '',
          value: ''
        },
        totalLines: 0,
        grandTotal: 0,
        salesRepresentative: {
          description: '',
          id: 0,
          name: '',
          uuid: ''
        },
        businessPartner: {
          description: '',
          duns: '',
          id: 0,
          lastName: '',
          naics: '',
          name: '',
          taxId: '',
          value: '',
          uuid: ''
        }
      }
    }
    return this.currentPointOfSales.currentOrder
  }

  get isDisabled(): boolean {
    return this.currentPointOfSales.currentOrder.isProcessed
  }

  get listOrderLine(): IOrderLineDataExtended[] {
    if (isEmptyValue(this.currentOrder)) {
      return []
    }
    return (this.currentOrder as ICurrentOrderData).lineOrder
  }

  get isShowedPOSKeyLayout(): boolean {
    return this.$store.getters[Namespaces.PointOfSales + '/' + 'getShowPOSKeyLayout']
  }

  set isShowedPOSKeyLayout(value: boolean) {
    this.$store.commit(Namespaces.PointOfSales + '/' + 'setShowPOSKeyLayout', value)
  }

  get styleTab() {
    const isShowedPOSOptions: boolean = this.$store.getters[Namespaces.PointOfSales + '/' + 'getIsShowPOSOptions']
    if (this.isShowedPOSKeyLayout || isShowedPOSOptions) {
      return 'adding-left: 0px; padding-right: 0px; padding-top: 2.5%;margin-right: 1%;'
    }
    return 'padding-left: 0px; padding-right: 0px; padding-top: 2.2%;margin-right: 1%;'
  }

  get orderDate(): string | undefined {
    try {
      if (isEmptyValue(this.currentOrder) || !this.currentOrder?.dateOrdered || isEmptyValue(this.currentOrder!.dateOrdered)) {
        const newDate = new Date().toLocaleDateString()
        return this.formatDate(newDate)
      }
      return this.formatDate(this.currentOrder!.dateOrdered)
    } catch (error) {
      return undefined
    }
  }

  get getItemQuantity(): number {
    if (isEmptyValue(this.currentOrder)) {
      return 0
    }
    const result: number[] = this.listOrderLine.map(order => {
      return order.quantityOrdered
    })

    if (!isEmptyValue(result)) {
      return result.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      })
    }
    return 0
  }

  get numberOfLines(): number | undefined {
    if (isEmptyValue(this.currentOrder)) {
      return
    }
    return this.listOrderLine.length
  }

  get multiplyRate(): number {
    return this.$store.getters[Namespaces.Payments + '/' + 'getMultiplyRate']
  }

  get converCurrency(): any {
    return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
      containerUuid: 'Collection-Convert-Amount',
      columnName: 'C_Currency_ID_UUID'
    })
  }

  get currencyUuid(): any {
    return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
      containerUuid: 'Collection-Convert-Amount',
      columnName: 'C_Currency_ID_UUID'
    })
  }

  // Methods
  openCollectionPanel(): void {
    this.isShowedPOSKeyLayout = !this.isShowedPOSKeyLayout
    this.$store.commit(Namespaces.PointOfSales + '/' + 'setShowPOSCollection', true)
    const orderUuid = this.$route.query.action
    this.$store.dispatch(Namespaces.Payments + '/' + 'listPayments', { orderUuid })
    this.isShowedPOSKeyLayout = !this.isShowedPOSKeyLayout
    this.$store.commit(Namespaces.PointOfSales + '/' + 'setShowPOSOptions', false)
  }

  mounted() {
    console.log('mounted')
    console.log(this.orderLineDefinition)
    if (!isEmptyValue(this.$route.query.action)) {
      this.$store.dispatch(Namespaces.Order + '/' + 'reloadOrder', { orderUuid: this.$route.query.action })
    }
  }

  open() : void {
    if (!this.seeConversion) {
      this.seeConversion = true
    }
  }

  getOrderTax(currency: any): string | undefined {
    return this.formatPrice(this.currentOrder.grandTotal! - this.currentOrder.totalLines!, currency)
  }

  newOrder() {
    this.$router.push({
      params: {
        ...this.$route.params
      },
      query: {
        pos: (this.currentPointOfSales.id as any)
      }
    }).catch(() => {
    }).finally(() => {
      this.$store.commit(Namespaces.Payments + '/' + 'setListPayments', [])
      const { templateBusinessPartner } = this.currentPointOfSales
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValuesOfContainer', {
        containerUuid: this.metadata.containerUuid,
        attributes: [{
          columnName: 'UUID',
          value: undefined
        },
        {
          columnName: 'ProductValue',
          value: undefined
        },
        {
          columnName: 'C_BPartner_ID',
          value: templateBusinessPartner?.id
        },
        {
          columnName: 'DisplayColumn_C_BPartner_ID',
          value: templateBusinessPartner?.name
        },
        {
          columnName: ' C_BPartner_ID_UUID',
          value: templateBusinessPartner?.uuid
        }]
      })
      this.$store.dispatch(Namespaces.Order + '/' + 'setOrder', {
        documentType: {},
        documentStatus: {
          value: ''
        },
        totalLines: 0,
        grandTotal: 0,
        salesRepresentative: {},
        businessPartner: {
          value: '',
          uuid: ''
        }
      })
      this.$store.commit(Namespaces.PointOfSales + '/' + 'setShowPOSCollection', false)
      this.$store.dispatch(Namespaces.OrderLines + '/' + 'listOrderLine', [])
    })
  }

  changePos(posElement: ICurrentPointOfSalesData) {
    this.$store.dispatch(Namespaces.PointOfSales + '/' + 'setCurrentPOS', posElement)
    this.newOrder()
  }

  arrowTop() {
    if (this.currentTable > 0) {
      this.currentTable--
      (this.$refs.linesTable as any).setCurrentRow(this.listOrderLine[this.currentTable])
      this.currentOrderLine = this.listOrderLine[this.currentTable]
    }
  }

  arrowBottom() {
    const top = this.listOrderLine.length - 1
    if (this.currentTable < top) {
      this.currentTable++
      (this.$refs.linesTable as any).setCurrentRow(this.listOrderLine[this.currentTable])
      this.currentOrderLine = this.listOrderLine[this.currentTable]
    }
  }
}
