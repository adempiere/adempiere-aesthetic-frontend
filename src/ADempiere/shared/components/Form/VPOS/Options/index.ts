import { Component, Mixins, Prop } from 'vue-property-decorator'
import Template from './template.vue'
import ListProductPrice from '@/ADempiere/shared/components/Form/VPOS/ProductInfo/ProductList'
import OrdersList from '@/ADempiere/shared/components/Form/VPOS/OrderList'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { IListOrderItemData, IListProductPriceItemData, IOrderData, IPointOfSalesData } from '@/ADempiere/modules/pos/POSType'
import {
  requestCashClosing, requestCompletePreparedOrder, requestCreateNewCustomerReturnOrder, requestCreateWithdrawal, requestGenerateImmediateInvoice, requestPrintOrder,
  // requestReverseSalesTransaction,
  requestDeleteOrder,
  requestCreateOrder,
  requestProcessOrder
} from '@/ADempiere/modules/pos/POSService'
import ModalDialog from '@/ADempiere/shared/components/Dialog'
import posProcess from '@/ADempiere/shared/utils/Constants/posProcess'
import MixinOrderLine from '../Order/MixinOrderLine'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'

@Component({
  name: 'Options',
  components: {
    ListProductPrice,
    OrdersList,
    ModalDialog
  },
  mixins: [Template, MixinOrderLine]
})
export default class Options extends Mixins(MixinOrderLine) {
    @Prop({ type: Object, default: {} }) metadata: any = {}
    activeName = ''
    public processPos = ''

    // Computed properties
    get isShowProductsPriceList(): boolean {
      const productPrice: IListProductPriceItemData = this.$store.state.listProductPriceModule.productPrice
      return productPrice.isShowPopoverMenu!
    }

    set isShowProductsPriceList(isShowed: boolean) {
      if ((this.$route.query.pos)) {
        this.$store.commit(Namespaces.ListProductPrice + '/' + 'showListProductPrice', {
          attribute: 'isShowPopoverMenu',
          isShowed
        })
      }
    }

    get isShowOrdersList(): boolean {
      const listOrder: IListOrderItemData = this.$store.getters[Namespaces.Order + '/' + 'getListOrder']
      return listOrder.isShowPopover
    }

    set isShowOrdersList(value: boolean) {
      if (this.$route.query.pos) {
        this.$store.commit(Namespaces.Order + '/' + 'showListOrders', value)
      }
    }

    get sellingPointsList(): IPointOfSalesData[] {
      return this.$store.getters[Namespaces.PointOfSales + '/' + 'getSellingPointsList']
    }

    get currentPOS(): IOrderData | undefined {
      return this.$store.getters[Namespaces.Order + '/' + 'getOrder']
    }

    get currentPoint(): IPointOfSalesData | undefined {
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
      const size = this.$store.getters[Namespaces.Utils + '/' + 'getWidthLeft']
      return 24 / size
    }

    // Methods
    notSubmitForm(event: any): boolean {
      event.preventDefault()
      return false
    }

    changePos(posElement: IPointOfSalesData): void {
      this.$store.dispatch(Namespaces.PointOfSales + '/' + 'setCurrentPOS', posElement)
      this.newOrder()
    }

    newOrder(): void {
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
        const { templateBusinessPartner } = this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS']

        // TODO: Set order with POS Terminal default values
        this.$store.commit(Namespaces.Payments + '/' + 'setListPayments', [])
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
        this.$store.commit(Namespaces.PointOfSales + '/' + 'setShowPOSCollection', false)

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
            value: this.$store.getters[Namespaces.User + '/' + 'getUserUuid']
          }]
        })
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
      const posUuid: string | undefined = this.currentPoint!.uuid!
      this.$store.dispatch(Namespaces.Utils + '/' + 'updateOrderPos', true)
      this.$store.dispatch(Namespaces.Utils + '/' + 'updatePaymentPos', true)
      this.$message({
        type: 'info',
        message: this.$t('notifications.processing').toString(),
        showClose: true
      })
      requestProcessOrder({
        posUuid,
        orderUuid: this.$route.query.action as string,
        createPayments: Boolean(this.$store.getters[Namespaces.Payments + '/' + 'getListPayments']),
        payments: this.$store.getters[Namespaces.Payments + '/' + 'getListPayments']
      }).then(response => {
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
        })
        .finally(() => {
          this.$store.dispatch(Namespaces.Order + '/' + 'listOrdersFromServer', {
            posUuid: this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS'].uuid
          })
          this.$store.dispatch(Namespaces.Utils + '/' + 'updateOrderPos', false)
          this.$store.dispatch(Namespaces.Utils + '/' + 'updatePaymentPos', false)
        })
    }

    reverseSalesTransaction(): void {
      const process = this.$store.getters[Namespaces.ProcessDefinition + '/' + 'getProcess'](posProcess[0].uuid)
      this.showModal(process)
      const parametersList = [
        {
          columnName: 'C_Order_ID',
          value: this.$store.getters[Namespaces.Order + '/' + 'getOrder'].id
        },
        {
          columnName: 'Bill_BPartner_ID',
          value: this.$store.getters[Namespaces.Order + '/' + 'getOrder'].businessPartner.id
        },
        {
          columnName: 'IsCancelled',
          value: false
        },
        {
          columnName: 'IsShipConfirm',
          value: true
        },
        {
          columnName: 'C_DocTypeRMA_ID',
          value: 'VO'
        }
      ]
      this.$store.dispatch(Namespaces.Utils + '/' + 'addParametersProcessPos')
    }

    createWithdrawal(): void {
      const { uuid: posUuid, id: posId } = this.currentPOS!
      // TODO: Add BParner, C_BankAccount_ID (caja), CashTransferBankAccount_ID, PAY_C_BankAccount_ID
      requestCreateWithdrawal({
        posId,
        posUuid: posUuid!
      })
    }

    showModal(action: {
      type: PanelContextType
      panelType: PanelContextType
      containerUuid: string
      parentUuid: string
      uuid: string
    }) {
      this.$store.dispatch(Namespaces.Process + '/' + 'setShowDialog', {
        type: action.type,
        action: {
          ...action,
          containerUuid: action.uuid
        }
      })
    }

    copyOrder() {
      this.processPos = posProcess[1].uuid
      const posUuid = this.currentPoint?.uuid

      const parametersList = [{
        columnName: 'C_Order_ID',
        value: this.$store.getters.getOrder.id
      }]

      this.$store.dispatch(Namespaces.Utils + '/' + 'addParametersProcessPos', parametersList)
      requestCreateOrder({
        posUuid: posUuid!,
        customerUuid: this.currentPOS!.businessPartner.uuid,
        salesRepresentativeUuid: this.currentPOS!.salesRepresentative.uuid
      })
        .then(order => {
          this.$store.dispatch(Namespaces.Order + '/' + 'currentOrder', order)
          this.$router.push({
            params: {
              ...this.$route.params
            },
            query: {
              ...this.$route.query,
              action: order.uuid
            }
          })
          this.$store.commit(Namespaces.Order + '/' + 'setIsReloadListOrders')
        })
        .catch(error => {
          console.error(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          const process = this.$store.getters[Namespaces.ProcessDefinition + '/' + 'getProcess'](posProcess[1].uuid)
          this.showModal(process)
        })
    }

    copyLineOrder() {
      this.processPos = posProcess[1].uuid
      const process = this.$store.getters[Namespaces.ProcessDefinition + '/' + 'getProcess'](posProcess[1].uuid)
      this.showModal(process)
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

    deleteOrder() {
      this.$store.dispatch(Namespaces.Utils + '/' + 'updateOrderPos', true)
      requestDeleteOrder({
        posUuid: <string> this.$route.query.action
      })
        .then(response => {
          this.changePos(this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS'])
        })
        .finally(() => {
          this.$store.dispatch(Namespaces.Order + '/' + 'listOrdersFromServer', {
            posUuid: this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS'].uuid
          })
          this.$message({
            type: 'success',
            message: this.$t('form.pos.optionsPoinSales.salesOrder.orderRemoved').toString(),
            showClose: true
          })
          this.$store.dispatch(Namespaces.Utils + '/' + 'updateOrderPos', false)
        })
    }

    seeOrderList() {
      if (this.$store.getters[Namespaces.Order + '/' + 'getListOrder'].recordCount <= 0) {
        this.$store.dispatch(Namespaces.Order + '/' + 'listOrdersFromServer', {})
      }
    }

    findProcess() {
      const findServer = this.$store.getters[Namespaces.ProcessDefinition + '/' + 'getProcess']('a42ad0c6-fb40-11e8-a479-7a0060f0aa01')
      if (!findServer) {
        posProcess.forEach(item => {
          this.$store.dispatch(Namespaces.ProcessDefinition + '/' + 'getProcessFromServer', { containerUuid: item.uuid, processId: item.id })
        })
      }
    }

    // Hooks
    created() {
      this.findProcess()
    }
}
