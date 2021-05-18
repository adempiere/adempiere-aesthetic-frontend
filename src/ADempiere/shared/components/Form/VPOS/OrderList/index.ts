import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import MixinForm from '../../MixinForm'
import CustomPagination from '@/ADempiere/shared/components/Pagination'
import fieldListOrders from './fieldListOrders'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { IListOrderItemData, IOrderData, IPOSAttributesData } from '@/ADempiere/modules/pos'
import Template from './template.vue'
import {
  formatDate,
  formatQuantity
} from '@/ADempiere/shared/utils/valueFormat'
import Field from '@/ADempiere/shared/components/Field'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import MixinPOS from '../MixinPOS'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'

@Component({
  name: 'OrdersList',
  components: {
    CustomPagination,
    Field
  },
  mixins: [MixinPOS, Template]
})
export default class OrdersList extends Mixins(MixinPOS) {
    @Prop({
      type: Object,
      default: () => {
        return {
          uuid: 'Orders-List',
          containerUuid: 'Orders-List'
        }
      }
    }) metadata: any

    @Prop({ type: Boolean, default: false }) showField!: boolean

    public defaultMaxPagination = 50
    fieldsList = fieldListOrders
    public isCustomForm = true
    public activeAccordion = 'query-criteria'
    public timeOut: any = null
    public metadataList: any[] = []
    panelType = PanelContextType.Form
    // public panelType: string = 'from'

    // Computed properties
    get heightTable(): 500 | 250 {
      if (isEmptyValue(this.activeAccordion)) {
        return 500
      }
      return 250
    }

    get highlightRow(): boolean {
      if (!isEmptyValue(this.selectOrder)) {
        return true
      }
      return false
    }

    get selectOrder(): IOrderData | null {
      const action = this.$route.query.action
      if (!isEmptyValue((this.ordersList as IListOrderItemData).list)) {
        const order = (this.ordersList as IListOrderItemData).list!.find(item => item.uuid === action)
        if (!isEmptyValue(order)) {
          return order!
        }
      }
      const order = (this.ordersList as IListOrderItemData).list?.find((item: any) => item.uuid === action)
      if (!isEmptyValue(order)) {
        return order!
      }
      return null
    }

    get isReadyFromGetData(): boolean {
      const { isReload } = <IListOrderItemData> this.ordersList
      return isReload
    }

    get shortsKey() {
      return {
        closeOrdersList: ['esc'],
        refreshList: ['f5']
      }
    }

    get sortFieldsListOrder() {
      return this.sortfield(this.metadataList)
    }

    get sortTableOrderList() {
      if (isEmptyValue((this.ordersList as IListOrderItemData).list)) {
        return []
      }
      return this.sortDate((this.ordersList as IListOrderItemData).list)
    }

    // Watcher
    @Watch('showField')
    hanldeShowFieldChange(value: any) {
      if (value && isEmptyValue(this.metadataList)) {
        this.setFieldsList()
      }
    }

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
      const point = (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales.uuid
      if (!isEmptyValue(point)) {
        this.$store.dispatch(Namespaces.Order + '/' + 'listOrdersFromServer', {
          posUuid: point
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
      if (!isEmptyValue(row)) {
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
          }, () => {})
        const orderUuid = this.$route.query.action
        this.$store.dispatch(Namespaces.Payments + '/' + 'listPayments', { orderUuid })
      }
    }

    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (
          mutation.type === Namespaces.FieldValue + '/' + 'updateValueOfField' &&
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

    // mounted(){
    //   console.log('showfield x')
    //   console.log(this.showField)
    // }

    orderProcess(row: any) {
      const parametersList = [{
        columnName: 'C_Order_ID',
        value: row.id
      }]
      this.$store.dispatch(Namespaces.Utils + '/' + 'addParametersProcessPos', parametersList)
    }

    setFieldsList(): void {
      const list: any[] = []

      // Create Panel
      this.$store.dispatch(Namespaces.Panel + '/' + 'addPanel', {
        containerUuid: this.metadata.containerUuid,
        isCustomForm: false,
        uuid: this.metadata.uuid,
        panelType: this.metadata.panelType,
        fieldsList: this.fieldsList
      })

      // Product Code
      this.fieldsList.forEach((element: any) => {
        this.createFieldFromDictionary(element)
          .then(response => {
            const data = response
            list.push({
              ...data,
              containerUuid: 'Orders-List'
            })
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
      })
      this.metadataList = list
    }

    sortDate(listDate: IOrderData[] | undefined) {
      return listDate?.sort((elementA, elementB) => {
        return new Date().setTime(new Date(elementB.dateOrdered).getTime()) - new Date().setTime(new Date(elementA.dateOrdered).getTime())
      })
    }

    sortfield(field: any[]) {
      return field.sort((elementA, elementB) => {
        return elementA.sequence - elementB.sequence
      })
    }
}
