import { Component, Mixins, Watch } from 'vue-property-decorator'
import BusinessPartner from '@/ADempiere/shared/components/Form/VPOS/BusinessPartner'
import ProductInfo from '@/ADempiere/shared/components/Form/VPOS/ProductInfo'
import MixinOrderLine from './MixinOrderLine'
import fieldListOrders from './fieldListOrders'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { IPointOfSalesData } from '@/ADempiere/modules/pos'
import convertAmount from '@/ADempiere/shared/components/Form/VPOS/Collection/ConvertAmount/index'
import Template from './template.vue'

@Component({
  name: 'Order',
  mixins: [MixinOrderLine, Template],
  components: {
    BusinessPartner,
    ProductInfo,
    convertAmount
  }
})
export default class Order extends Mixins(MixinOrderLine) {
  public fieldList = fieldListOrders
  public seeConversion = false

  // Computed properties
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
      return 'adding-left: 0px; padding-right: 0px; padding-top: 3.5%;'
    }
    return 'padding-left: 30px; padding-right: 0px; padding-top: 2.2%;'
  }

  get namePointOfSales(): IPointOfSalesData | undefined {
    const currentPOS: IPointOfSalesData | undefined = this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS']
    if (currentPOS && (currentPOS.name)) {
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
    if ((!this.getOrder) || (!this.getOrder.dateOrdered)) {
      return this.formatDate(new Date())
    }
    return this.formatDate(this.getOrder.dateOrdered)
  }

  get getItemQuantity(): number {
    if (!this.getOrder) {
      return 0
    }
    const result: number[] = this.allOrderLines.map(order => {
      return order.quantityOrdered
    })

    if (result) {
      return result.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      })
    }
    return 0
  }

  get numberOfLines(): number | undefined {
    if (!this.getOrder) {
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
    if (value && this.currentPoint) {
      this.$store.dispatch(Namespaces.Payments + '/' + 'conversionDivideRate', {
        conversionTypeUuid: this.$store.getters.getCurrentPOS.conversionTypeUuid,
        currencyFromUuid: this.currencyPoint.uuid,
        currencyToUuid: value
      })
    }
  }

  @Watch('converCurrency')
  handleConverCurrency(value: any) {
    if (value && this.currentPoint) {
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
    if (value) {
      this.$router.push({
        query: {
          pos: String(value.id)
        }
      })
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
    }).finally(() => {
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

      this.$store.dispatch(Namespaces.OrderLines + '/' + 'listOrderLine', [])
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
  }

  mounted() {
    if (this.$route.query.action) {
      this.$store.dispatch(Namespaces.Order + '/' + 'reloadOrder', { orderUuid: this.$route.query.action })
    }
    setTimeout(() => {
      this.currencyDisplaye()
    }, 1500)
  }

  open() : void {
    if (!this.seeConversion) {
      this.seeConversion = true
    }
  }

  tenderTypeDisplaye() {
    if (this.fieldList && this.fieldList.length) {
      const tenderType = this.fieldList[5].reference
      if (tenderType) {
        this.$store.dispatch(Namespaces.Lookup + '/' + 'getLookupListFromServer', {
          tableName: tenderType.tableName,
          query: tenderType.query
        })
          .then(response => {
            this.$store.dispatch(Namespaces.Payments + '/' + 'tenderTypeDisplaye', response)
          })
      }
    }
  }

  currencyDisplaye() {
    if (this.fieldList && this.fieldList.length) {
      const currency = this.fieldList[4].reference
      if (currency) {
        this.$store.dispatch(Namespaces.Lookup + '/' + 'getLookupListFromServer', {
          tableName: currency.tableName,
          query: currency.query
        })
          .then(response => {
            this.$store.dispatch(Namespaces.Payments + '/' + 'currencyDisplaye', response)
          })
      }
    }
  }
}
