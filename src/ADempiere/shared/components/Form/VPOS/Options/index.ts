import { Component, Prop, Vue } from 'vue-property-decorator'
import Template from './template.vue'
import ListProductPrice from '@/ADempiere/shared/components/Form/VPOS/ProductInfo/ProductList'
import OrdersList from '@/ADempiere/shared/components/Form/VPOS/OrderList'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { IPointOfSalesData } from '@/ADempiere/modules/pos/POSType'
import { requestCashClosing, requestCompletePreparedOrder, requestCreateNewCustomerReturnOrder, requestCreateWithdrawal, requestGenerateImmediateInvoice, requestPrintOrder, requestReverseSalesTransaction } from '@/ADempiere/modules/pos/POSService'

@Component({
  name: 'Options',
  components: {
    ListProductPrice,
    OrdersList
  },
  mixins: [Template]
})
export default class Options extends Vue {
    @Prop({ type: Object, default: {} }) metadata: any = {}
    activeName = ''

    // Computed properties
    get isShowProductsPriceList(): boolean {
      return this.$store.state['pointOfSales/listProductPrice'].productPrice.isShowPopoverMenu
    }

    set isShowProductsPriceList(isShowed: boolean) {
      if ((this.$route.query.pos)) {
        this.$store.commit('showListProductPrice', {
          attribute: 'isShowPopoverMenu',
          isShowed
        })
      }
    }

    get isShowOrdersList() {
      return this.$store.getters.getListOrder.isShowPopover
    }

    set isShowOrdersList(value: any) {
      if (this.$route.query.pos) {
        this.$store.commit('showListOrders', value)
      }
    }

    get sellingPointsList(): IPointOfSalesData[] {
      return this.$store.getters[Namespaces.PointOfSales + '/' + 'getSellingPointsList']
    }

    get currentPOS(): IPointOfSalesData | undefined {
      return this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS']
    }

    get pointOfSalesId(): number | undefined {
      const currentPOS = this.currentPOS
      if (currentPOS) {
        return currentPOS.id
      }
      return undefined
    }

    get blockOption() {
      if (this.$route.query.pos) {
        return 'cursor: pointer; text-align: center !important; color: black'
      }
      return 'cursor: not-allowed; text-align: center !important; color: gray;'
    }

    get size(): number {
      const size = this.$store.getters.getWidthLeft
      return 24 / size
    }

    // Methods
    notSubmitForm(event: any): boolean {
      event.preventDefault()
      return false
    }

    changePos(posElement: IPointOfSalesData): void {
      this.$store.dispatch('setCurrentPOS', posElement)
      this.newOrder()
    }

    newOrder(): void {
      this.$store.dispatch('findOrderServer', {})

      const pos: string = String(this.pointOfSalesId) || this.$route.query.pos.toString()
      this.$router.push({
        params: {
          ...this.$route.params
        },
        query: {
          pos
        }
      }).catch(error => {
        console.info(`VPOS/Options component (New Order): ${error.message}`)
      }).finally(() => {
        const { templateBusinessPartner } = this.currentPOS!

        this.$store.commit('updateValuesOfContainer', {
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

        // TODO: Set order with POS Terminal default values
        // this.order = {
        //   documentType: {},
        //   documentStatus: {},
        //   salesRepresentative: this.currentPOS.salesRepresentative
        //
        this.$store.dispatch('listOrderLine', [])
      })
    }

    printOrder(): void {
      requestPrintOrder({
        orderUuid: this.$route.query.action.toString()
      })
    }

    generateImmediateInvoice(): void {
      // TODO: Add BPartner
      const { uuid: posUuid, id: posId } = this.currentPOS!
      requestGenerateImmediateInvoice({
        posId,
        posUuid: posUuid!
      })
    }

    completePreparedOrder(): void {
      requestCompletePreparedOrder({
        orderUuid: this.$route.query.action.toString()
      })
    }

    reverseSalesTransaction(): void {
      // TODO: Add BPartner
      requestReverseSalesTransaction({
        orderUuid: this.$route.query.action.toString()
      })
    }

    createWithdrawal(): void {
      const { uuid: posUuid, id: posId } = this.currentPOS!
      // TODO: Add BParner, C_BankAccount_ID (caja), CashTransferBankAccount_ID, PAY_C_BankAccount_ID
      requestCreateWithdrawal({
        posId,
        posUuid: posUuid!
      })
    }

    createNewCustomerReturnOrder(): void {
      requestCreateNewCustomerReturnOrder({
        orderUuid: this.$route.query.action.toString()
      })
    }

    cashClosing(): void {
      const { uuid: posUuid, id: posId } = this.currentPOS!
      requestCashClosing({
        posId,
        posUuid: posUuid!
      })
    }
}
