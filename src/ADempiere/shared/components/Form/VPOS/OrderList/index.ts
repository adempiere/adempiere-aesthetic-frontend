import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import MixinForm from '../../MixinForm'
import CustomPagination from '@/ADempiere/shared/components/Pagination'
import fieldListOrders from './fieldListOrders'
import { IFieldLocation } from '../../../Field/FieldLocation/fieldList'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { IListOrderItemData, IOrderData } from '@/ADempiere/modules/pos'
import Template from './template.vue'
import {
  formatDate,
  formatQuantity
} from '@/ADempiere/shared/utils/valueFormat'

@Component({
  name: 'OrdersList',
  components: {
    CustomPagination
  },
  mixins: [MixinForm, Template]
})
export default class OrdersList extends Mixins(MixinForm) {
    @Prop({
      type: Object,
      default: {
        uuid: 'Orders-List',
        containerUuid: 'Orders-List'
      }
    })
    metadata: any = {
      uuid: 'Orders-List',
      containerUuid: 'Orders-List'
    }

    public defaultMaxPagination = 50
    // public fieldsList: IFieldLocation[] = fieldListOrders
    fieldsList = fieldListOrders
    public isCustomForm = true
    public activeAccordion = 'query-criteria'
    public timeOut: any = null

    // Computed properties
    get heightTable(): 500 | 250 {
      if (!this.activeAccordion) {
        return 500
      }
      return 250
    }

    get highlightRow(): boolean {
      if (this.selectOrder) {
        return true
      }
      return false
    }

    get tableOrder(): IListOrderItemData | Partial<IListOrderItemData> {
      return this.$store.getters[Namespaces.Order + '/' + 'getListOrder']
    }

    get ordersList(): IOrderData[] {
      const order = this.tableOrder
      if (order && order.list) {
        return order.list
      }
      return []
    }

    get selectOrder(): IOrderData | null {
      const action = this.$route.query.action
      const order = this.ordersList.find((item: any) => item.uuid === action)
      if (order) {
        return order
      }
      return null
    }

    get isReadyFromGetData(): boolean {
      const { isLoaded, isReload } = <IListOrderItemData> this.tableOrder
      return !isLoaded || isReload
    }

    get shortsKey() {
      return {
        closeOrdersList: ['esc'],
        refreshList: ['f5']
      }
    }

    // Watcher
    // @Watch('isReadyFromGetData')
    // handleIsReadyFromGetDataChange(isToLoad: boolean) {
    //   if (isToLoad) {
    //     this.loadOrdersList()
    //   }
    // }

    // Hooks
    created() {
      this.unsubscribe = this.subscribeChanges()

      if (this.isReadyFromGetData) {
        this.loadOrdersList()
      }
    }

    beforeDestroy() {
      this.unsubscribe()
    }

    // Methods
    formatDate = formatDate

    formatQuantity = formatQuantity

    keyAction(event: any) {
      switch (event.srcKey) {
        case 'refreshList':
          this.loadOrdersList()
          break

        case 'closeOrdersList':
          this.$store.commit(Namespaces.Order + '/' + 'showListOrders', false)
          break
      }
    }

    loadOrdersList() {
      let values = this.$store.getters[
        Namespaces.FieldValue + '/' + 'getValuesView'
      ]({
        containerUuid: this.metadata.containerUuid
      })

      values = this.convertValuesToSend(values)
      const point = this.$store.getters[Namespaces.PointOfSales + '/' + 'getPointOfSalesUuid']
      if (point) {
        this.$store.dispatch(Namespaces.Order + '/' + 'listOrdersFromServer', {
          ...values
        })
      }
    }

    handleChangePage(newPage: number): void {
      this.$store.dispatch(Namespaces.Order + '/' + 'setOrdersListPageNumber', newPage)
    }

    handleCurrentChange(row: any): void {
      // close popover
      this.$store.commit(Namespaces.Order + '/' + 'showListOrders', false)
      this.$store.dispatch(Namespaces.Order + '/' + 'currentOrder', row)
      if (row) {
        this.$store.dispatch(Namespaces.Payments + '/' + 'deleteAllCollectBox')
        this.$router.push(
          {
            params: {
              ...this.$route.params
            },
            query: {
              ...this.$route.query,
              action: row.uuid
            }
          }
        )
        const orderUuid = this.$route.query.action
        this.$store.dispatch(Namespaces.Payments + '/' + 'listPayments', { orderUuid })
      }
    }

    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (
          mutation.type === 'updateValueOfField' &&
                !mutation.payload.columnName.includes('DisplayColumn') &&
                !mutation.payload.columnName.includes('_UUID') &&
                mutation.payload.containerUuid === this.metadata.containerUuid
        ) {
          clearTimeout(this.timeOut)

          this.timeOut = setTimeout(() => {
            this.loadOrdersList()
          }, 2000)
        }
      })
    }

    orderProcess(row: any) {
      const parametersList = [{
        columnName: 'C_Order_ID',
        value: row.id
      }]
      this.$store.dispatch(Namespaces.Utils + '/' + 'addParametersProcessPos', parametersList)
    }

    convertValuesToSend(values: any[]): IKeyValueObject {
      const valuesToSend: IKeyValueObject = {}

      values.forEach(element => {
        const { value, columnName } = element

        if (!value) {
          return
        }

        switch (columnName) {
          case 'DocumentNo':
            valuesToSend.documentNo = value
            break
          case 'C_BPartner_ID_UUID':
            valuesToSend.businessPartnerUuid = value
            break
          case 'GrandTotal':
            valuesToSend.grandTotal = value
            break
          case 'OpenAmt':
            valuesToSend.openAmount = value
            break
          case 'IsPaid':
            valuesToSend.isPaid = value
            break
          case 'Processed':
            valuesToSend.isProcessed = value
            break
          case 'IsAisleSeller':
            valuesToSend.isAisleSeller = value
            break
          case 'IsInvoiced':
            valuesToSend.isInvoiced = value
            break
          case 'DateOrderedFrom':
            valuesToSend.dateOrderedFrom = value
            break
          case 'DateOrderedTo':
            valuesToSend.dateOrderedTo = value
            break
          case 'SalesRep_ID_UUID':
            valuesToSend.salesRepresentativeUuid = value
            break
        }
      })

      return valuesToSend
    }
}
