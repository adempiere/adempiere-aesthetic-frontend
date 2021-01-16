import { Component, Mixins } from 'vue-property-decorator'
import BusinessPartner from '@/ADempiere/shared/components/Form/VPOS/BusinessPartner'
import ProductInfo from '@/ADempiere/shared/components/Form/VPOS/ProductInfo'
import MixinOrderLine from './MixinOrderLine'
import fieldListOrders from './fieldListOrders'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { IPointOfSalesData } from '@/ADempiere/modules/pos'
import Template from './template.vue'

@Component({
  name: 'Order',
  mixins: [MixinOrderLine, Template],
  components: {
    BusinessPartner,
    ProductInfo
  }
})
export default class Order extends Mixins(MixinOrderLine) {
  public fieldList = fieldListOrders

  // Computed properties
  get isShowedPOSKeyLayout(): boolean {
    return this.$store.getters[Namespaces.PointOfSales + '/' + 'getShowPOSKeyLayout']
  }

  set isShowedPOSKeyLayout(value: boolean) {
    this.$store.commit('setShowPOSKeyLayout', value)
  }

  get styleTab() {
    const isShowedPOSOptions: boolean = this.$store.getters[Namespaces.PointOfSales + '/' + 'getIsShowPOSOptions']
    if (this.isShowedPOSKeyLayout || isShowedPOSOptions) {
      return 'adding-left: 0px; padding-right: 0px; padding-top: 3.5%;'
    }
    return 'padding-left: 30px; padding-right: 0px; padding-top: 2.2%;'
  }

  get namePointOfSales(): string | undefined {
    const currentPOS: IPointOfSalesData | undefined = this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS']
    if (currentPOS && (currentPOS.name)) {
      return currentPOS.name
    }
    return undefined
  }

  get sellingPointsList(): IPointOfSalesData[] {
    return this.$store.getters[Namespaces.PointOfSales + '/' + 'getSellingPointsList']
  }

  get orderDate(): string | undefined {
    if ((!this.order) || (!this.order.dateOrdered)) {
      return this.formatDate(new Date())
    }
    return this.formatDate(this.order.dateOrdered)
  }

  get getItemQuantity(): number {
    if (!this.currentOrder) {
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
    if (!this.currentOrder) {
      return
    }
    return this.allOrderLines.length
  }

  // Methods
  changePos(posElement: IPointOfSalesData) {
    this.$store.dispatch('setCurrentPOS', posElement)
    this.newOrder()
  }

  openCollectionPanel(): void {
    this.$store.commit('setShowPOSCollection', !this.$store.getters[Namespaces.PointOfSales + '/' + 'getShowCollectionPos'])
    this.isShowedPOSKeyLayout = true
    this.$store.commit('setShowPOSOptions', false)
  }

  newOrder(): void {
    this.$store.dispatch('findOrderServer', {})
    this.$router.push({
      params: {
        ...this.$route.params
      },
      query: {
        pos: this.currentPoint!.id.toString()
      }
    }).finally(() => {
      const { templateBusinessPartner } = this.currentPoint!

      this.$store.commit('updateValuesOfContainer', {
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
          value: templateBusinessPartner.id
        },
        {
          columnName: 'DisplayColumn_C_BPartner_ID',
          value: templateBusinessPartner.name
        },
        {
          columnName: ' C_BPartner_ID_UUID',
          value: templateBusinessPartner.uuid
        }]
      })

      this.$store.dispatch('listOrderLine', [])
    })
  }
}
