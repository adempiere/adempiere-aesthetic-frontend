import { Component, Mixins, Prop } from 'vue-property-decorator'
import Template from './template.vue'
import ListProductPrice from '@/ADempiere/shared/components/Form/VPOS/ProductInfo/ProductList'
import OrdersList from '@/ADempiere/shared/components/Form/VPOS/OrderList'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { IListOrderItemData, ListProductPriceState } from '@/ADempiere/modules/pos/POSType'
import {
  cashClosing, createNewReturnOrder, withdrawal, generateImmediateInvoice, printOrder,
  // requestReverseSalesTransaction,
  requestDeleteOrder,
  requestCreateOrder,
  processOrder
} from '@/ADempiere/modules/pos/POSService'
import ModalDialog from '@/ADempiere/shared/components/Dialog'
import posProcess from '@/ADempiere/shared/utils/Constants/posProcess'
import MixinOrderLine from '../Order/MixinOrderLine'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import MixinPOS from '../MixinPOS'

@Component({
  name: 'Options',
  components: {
    ListProductPrice,
    OrdersList,
    ModalDialog
  },
  mixins: [Template, MixinOrderLine, MixinPOS]
})
export default class Options extends Mixins(MixinOrderLine, MixinPOS) {
    @Prop({
      type: Object,
      default: () => {
        return {}
      }
    }) metadata: any

    activeName = ''
    public processPos = ''
    public showFieldListOrder = false

    // Computed properties
    get isShowProductsPriceList(): boolean {
      const isShowPopoverMenu: boolean = (this.$store.state[Namespaces.ProductPrice] as ListProductPriceState).productPrice.isShowPopoverMenu!
      return isShowPopoverMenu
    }

    set isShowProductsPriceList(isShowed: boolean) {
      if (!isEmptyValue(this.$route.query.pos)) {
        this.$store.commit(Namespaces.ProductPrice + '/' + 'showListProductPrice', {
          attribute: 'isShowPopoverMenu',
          isShowed
        })
      }
    }

    get isShowOrdersList(): boolean {
      return (this.ordersList as IListOrderItemData).isShowPopover
    }

    set isShowOrdersList(value: boolean) {
      if (!isEmptyValue(this.$route.query.pos)) {
        this.$store.commit(Namespaces.Order + '/' + 'showListOrders', value)
      }
    }

    get blockOption() {
      if (!isEmptyValue(this.$route.query.pos)) {
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

    printOrder(): void {
      printOrder({
        orderUuid: this.$route.query.action.toString()
      })
    }

    generateImmediateInvoice(): void {
      // TODO: Add BPartner
      const { uuid: posUuid, id: posId } = this.currentPointOfSales!
      generateImmediateInvoice({
        posId: posId!,
        posUuid: posUuid!
      })
    }

    completePreparedOrder(): void {
      const posUuid: string | undefined = this.currentPointOfSales!.uuid!
      this.$store.dispatch(Namespaces.Utils + '/' + 'updateOrderPos', true)
      this.$store.dispatch(Namespaces.Utils + '/' + 'updatePaymentPos', true)
      this.$message({
        type: 'info',
        message: this.$t('notifications.processing').toString(),
        showClose: true
      })

      processOrder({
        posUuid,
        orderUuid: this.$route.query.action as string,
        createPayments: !isEmptyValue(this.currentOrder.listPayments),
        payments: this.currentOrder.listPayments!.payments!
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
            posUuid: this.currentPointOfSales.uuid
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
          key: 'C_Order_ID',
          value: this.currentOrder.id
        },
        {
          key: 'Bill_BPartner_ID',
          value: this.currentOrder.businessPartner?.id
        },
        {
          key: 'IsCancelled',
          value: false
        },
        {
          key: 'IsShipConfirm',
          value: true
        },
        {
          key: 'C_DocTypeRMA_ID',
          value: 'VO'
        }
      ]
      this.$store.dispatch(Namespaces.Utils + '/' + 'addParametersProcessPos', parametersList)
    }

    withdrawal(): void {
      const { uuid: posUuid, id: posId } = this.currentPointOfSales!
      // TODO: Add BParner, C_BankAccount_ID (caja), CashTransferBankAccount_ID, PAY_C_BankAccount_ID
      withdrawal({
        posId: posId!,
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
      const posUuid = this.currentPointOfSales?.uuid

      const parametersList = [{
        key: 'C_Order_ID',
        value: this.currentPointOfSales
      }]

      this.$store.dispatch(Namespaces.Utils + '/' + 'addParametersProcessPos', parametersList)
      const salesRepresentative = this.currentPointOfSales.salesRepresentative
      const customer = this.currentOrder.businessPartner
      requestCreateOrder({
        posUuid: posUuid!,
        customerUuid: customer!.uuid || '',
        salesRepresentativeUuid: salesRepresentative!.uuid! || ''
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
      createNewReturnOrder({
        orderUuid: this.$route.query.action.toString()
      })
    }

    cashClosing(): void {
      const { uuid: posUuid, id: posId } = this.currentPointOfSales!
      cashClosing({
        posId: posId!,
        posUuid: posUuid!
      })
    }

    deleteOrder() {
      this.$store.dispatch(Namespaces.Utils + '/' + 'updateOrderPos', true)
      requestDeleteOrder({
        posUuid: <string> this.$route.query.action
      })
        .then(response => {
          this.changePos(this.currentPointOfSales)
        })
        .finally(() => {
          this.$store.dispatch(Namespaces.Order + '/' + 'listOrdersFromServer', {
            posUuid: this.currentPointOfSales.uuid
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
      const listOrder: IListOrderItemData = (this.ordersList as IListOrderItemData)
      if (listOrder.recordCount! <= 0) {
        this.$store.dispatch(Namespaces.Order + '/' + 'listOrdersFromServer', {})
      }
    }

    findProcess() {
      const findServer = this.$store.getters[Namespaces.ProcessDefinition + '/' + 'getProcess']('a42ad0c6-fb40-11e8-a479-7a0060f0aa01')
      if (isEmptyValue(findServer)) {
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
