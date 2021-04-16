import { Component, Mixins, Watch } from 'vue-property-decorator'
import BusinessPartner from '@/ADempiere/shared/components/Form/VPOS/BusinessPartner'
import ProductInfo from '@/ADempiere/shared/components/Form/VPOS/ProductInfo'
import MixinOrderLine from './MixinOrderLine'
import fieldListOrders from './fieldListOrders'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { IPointOfSalesData } from '@/ADempiere/modules/pos'
import ConvertAmount from '@/ADempiere/shared/components/Form/VPOS/Collection/ConvertAmount/index'
import Template from './template.vue'
import FieldLine from '@/ADempiere/shared/components/Form/VPOS/Order/Line'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'

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
  get isDisabled(): boolean {
    return this.$store.getters[Namespaces.Order + '/' + 'getIsProcessed']
  }

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

  get namePointOfSales(): IPointOfSalesData | undefined {
    const currentPOS: IPointOfSalesData | undefined = this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS']
    if (currentPOS && !isEmptyValue(currentPOS.name)) {
      return currentPOS
    }
    return {
      name: '',
      uuid: ''
    } as IPointOfSalesData
  }

  get sellingPointsList(): IPointOfSalesData[] {
    return this.$store.getters[Namespaces.PointOfSales + '/' + 'getSellingPointsList']
  }

  get orderDate(): string | undefined {
    try {
      if (isEmptyValue(this.getOrder) || !this.getOrder?.dateOrdered || isEmptyValue(this.getOrder!.dateOrdered)) {
        const newDate = new Date().toLocaleDateString()
        return this.formatDate(newDate)
      }
      return this.formatDate(this.getOrder!.dateOrdered)
    } catch (error) {
      return undefined
    }
  }

  get getItemQuantity(): number {
    if (isEmptyValue(this.getOrder)) {
      return 0
    }
    const result: number[] = this.allOrderLines.map(order => {
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
    if (isEmptyValue(this.getOrder)) {
      return
    }
    return this.allOrderLines.length
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

  get displayeTypeCurrency(): any {
    return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
      containerUuid: this.containerUuid,
      columnName: 'DisplayColumn_C_Currency_ID'
    })
  }

  // Watchers
  @Watch('currencyUuid')
  handleCurrencyUuid(value: string) {
    if (!isEmptyValue(value) && !isEmptyValue(this.currentPoint)) {
      this.$store.dispatch(Namespaces.Payments + '/' + 'conversionDivideRate', {
        conversionTypeUuid: this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS'].conversionTypeUuid,
        currencyFromUuid: this.currencyPoint.uuid,
        currencyToUuid: value
      })
    }
  }

  @Watch('converCurrency')
  handleConverCurrency(value: any) {
    if (!isEmptyValue(value) && !isEmptyValue(this.currentPoint)) {
      this.$store.dispatch(Namespaces.Payments + '/' + 'conversionMultiplyRate', {
        containerUuid: 'Order',
        conversionTypeUuid: this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS'].conversionTypeUuid,
        currencyFromUuid: this.currencyPoint.uuid,
        currencyToUuid: value
      })
    } else {
      this.$store.commit(Namespaces.Payments + '/' + 'currencyMultiplyRate', 1)
    }
  }

  @Watch('namePointOfSales')
  handleNamePointOfSalesChange(value: IPointOfSalesData | undefined) {
    if (!isEmptyValue(value)) {
      this.$router.push({
        query: {
          pos: String(value!.id)
        }
      })
        .catch(
        // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {})
    }
  }

  // Methods
  changePos(posElement: IPointOfSalesData) {
    this.$store.dispatch(Namespaces.PointOfSales + '/' + 'setCurrentPOS', posElement)
    this.newOrder()
  }

  openCollectionPanel(): void {
    this.isShowedPOSKeyLayout = !this.isShowedPOSKeyLayout
    this.$store.commit(Namespaces.PointOfSales + '/' + 'setShowPOSCollection', true)
    const orderUuid = this.$route.query.action
    this.$store.dispatch(Namespaces.Payments + '/' + 'listPayments', { orderUuid })
    this.isShowedPOSKeyLayout = !this.isShowedPOSKeyLayout
    this.$store.commit(Namespaces.PointOfSales + '/' + 'setShowPOSOptions', false)
  }

  newOrder(): void {
    this.$router.push({
      params: {
        ...this.$route.params
      },
      query: {
        pos: this.currentPoint!.id.toString()
      }
    })
      .catch(() => undefined)
      .finally(() => {
        this.$store.commit(Namespaces.Payments + '/' + 'setListPayments', [])
        const { templateBusinessPartner } = this.currentPoint!

        this.$store.commit(Namespaces.FieldValue + '/' + 'updateValuesOfContainer', {
          containerUuid: this.metadata.containerUuid,
          attributes: [{
            key: 'UUID',
            value: undefined
          },
          {
            key: 'ProductValue',
            value: undefined
          },
          {
            key: 'C_BPartner_ID',
            value: templateBusinessPartner.id
          },
          {
            key: 'DisplayColumn_C_BPartner_ID',
            value: templateBusinessPartner.name
          },
          {
            key: ' C_BPartner_ID_UUID',
            value: templateBusinessPartner.uuid
          }]
        })
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
    this.$store.dispatch(Namespaces.OrderLines + '/' + 'listOrderLine', [])
  }

  mounted() {
    console.log('all orderlines')
    console.log(this.allOrderLines)
    console.log('mounted')
    console.log(this.orderLineDefinition)
    if (!isEmptyValue(this.$route.query.action)) {
      this.$store.dispatch(Namespaces.Order + '/' + 'reloadOrder', { orderUuid: this.$route.query.action })
    }
    // setTimeout(() => {
    //   // this.currencyDisplaye()
    // }, 1500)
  }

  open() : void {
    if (!this.seeConversion) {
      this.seeConversion = true
    }
  }

  // tenderTypeDisplaye() {
  //   if (this.fieldsList && this.fieldsList.length) {
  //     const tenderType = this.fieldsList[5].reference
  //     if (tenderType) {
  //       this.$store.dispatch(Namespaces.Lookup + '/' + 'getLookupListFromServer', {
  //         tableName: tenderType.tableName,
  //         query: tenderType.query
  //       })
  //         .then(response => {
  //           this.$store.dispatch(Namespaces.Payments + '/' + 'tenderTypeDisplaye', response)
  //         })
  //     }
  //   }
  // }

  // currencyDisplaye() {
  //   if (this.fieldsList && this.fieldsList.length) {
  //     const currency = this.fieldsList[4].reference
  //     if (currency) {
  //       this.$store.dispatch(Namespaces.Lookup + '/' + 'getLookupListFromServer', {
  //         tableName: currency.tableName,
  //         query: currency.query
  //       })
  //         .then(response => {
  //           this.$store.dispatch(Namespaces.Payments + '/' + 'currencyDisplaye', response)
  //         })
  //     }
  //   }
  // }
}
