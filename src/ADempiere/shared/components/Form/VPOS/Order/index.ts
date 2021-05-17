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

  // Watchers
  // @Watch('currencyUuid')
  // handleCurrencyUuidChange(value: string) {
  //   if (!isEmptyValue(value) && !isEmptyValue(this.currentPointOfSales)) {
  //     this.$store.dispatch(Namespaces.Payments + '/' + 'conversionDivideRate', {
  //       conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
  //       currencyFromUuid: this.pointOfSalesCurrency.uuid,
  //       currencyToUuid: value
  //     })
  //   }
  // }

  // @Watch('converCurrency')
  // handleConverCurrencyChange(value: any) {
  //   if (!isEmptyValue(value) && !isEmptyValue(this.currentPointOfSales)) {
  //     this.$store.dispatch(Namespaces.Payments + '/' + 'conversionMultiplyRate', {
  //       containerUuid: 'Order',
  //       conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
  //       currencyFromUuid: this.pointOfSalesCurrency.uuid,
  //       currencyToUuid: value
  //     })
  //   } else {
  //     this.$store.commit(Namespaces.Payments + '/' + 'currencyMultiplyRate', 1)
  //   }
  // }

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
}
