import {
  IBusinessPartnerData,
  IProductPriceData,
  requestGetProductPrice as findProduct
} from '@/ADempiere/modules/core'
import {
  IListOrderItemData,
  IOrderData,
  IOrderLineData,
  IOrderLineDataExtended,
  IPointOfSalesData,
  requestCreateOrderLine,
  requestUpdateOrderLine
} from '@/ADempiere/modules/pos'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Vue, Prop, Ref, Watch, Mixins } from 'vue-property-decorator'
import {
  formatPrice,
  formatQuantity,
  formatDate
} from '@/ADempiere/shared/utils/valueFormat'
import { Table } from 'element-ui'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import MixinForm from '../MixinForm'

@Component({
  name: 'MixinPOS',
  mixins: [MixinForm]
})
export default class MixinPOS extends Mixins(MixinForm) {
    @Prop({ type: Object, required: false }) metadata?: any
    @Ref() readonly linesTable?: Table
    // eslint-disable-next-line
    public unsubscribe: Function = () => {}
    public product: any = {}

    public currentTable = 0
    public currentOrderLine: any = {
      product: {
        value: 0,
        name: '',
        description: '',
        priceStandard: 0
      },
      taxIndicator: 0,
      quantityOrdered: 0
    }

    public orderLines: any[] = []
    public products: any = {
      uuid: '',
      quantityAvailable: 0
    }

    public edit = false
    public displayType = ''
    // public containerUuid?: string
    public parentUuid?: string
  seeConversion: any

  // Computed properties
  get allOrderLines() {
    return this.listOrderLine
  }

  get listOrderLine(): IOrderLineDataExtended[] {
    console.log('ListOrderLine')
    const orders = this.$store.getters[
      Namespaces.OrderLines + '/' + 'getListOrderLine'
    ]
    console.log(orders)
    return orders
  }

  get ordersList(): IOrderData[] {
    const order: IListOrderItemData = this.$store.getters[
      Namespaces.Order + '/' + 'getListOrder'
    ]
    if (order && order.list) {
      return order.list
    }
    return []
  }

  get currentOrder(): IOrderData | Partial<IOrderData> {
    const action = this.$route.query.action
    console.log('currentOrder req')
    console.log(action)
    if (!isEmptyValue(action)) {
      return this.$store.getters[Namespaces.Order + '/' + 'getOrder']
    }

    return {
      documentType: undefined,
      documentStatus: {
        value: '',
        description: '',
        name: ''
      },
      totalLines: 0,
      grandTotal: 0,
      salesRepresentative: undefined,
      businessPartner: {
        description: '',
        duns: '',
        id: 0,
        lastName: '',
        naics: '',
        name: '',
        taxId: '',
        uuid: '',
        value: ''
      }
    }
  }

  get currentPoint(): IPointOfSalesData | undefined {
    return this.$store.getters[
      Namespaces.PointOfSales + '/' + 'getCurrentPOS'
    ]
  }

  get priceListUuid(): string | undefined {
    // const currentPOS: IPointOfSalesData | undefined = this.currentPoint
    const currentPOS = this.currentPoint
    if (isEmptyValue(currentPOS)) {
      return undefined
    }
    return this.currentPoint!.priceList.uuid
  }

  get getWarehouse() {
    return this.$store.getters[Namespaces.User + '/' + 'getWarehouse']
  }

  get isSetTemplateBP(): IBusinessPartnerData | false {
    const currentPOS = this.currentPoint
    if (
      currentPOS &&
            currentPOS.templateBusinessPartner &&
            !this.$route.query.action
    ) {
      return currentPOS.templateBusinessPartner
    }
    return false
  }

  get updateOrderProcessPos() : boolean {
    return this.$store.getters[Namespaces.Utils + '/' + 'getUpdateOrderPos']
  }

  get getOrder(): Partial<IOrderData> | undefined {
    const order: Partial<IOrderData> | undefined = this.$store.getters[Namespaces.Order + '/' + 'getPos'].currentOrder
    return order
  }

  // Watchers
  @Watch('getOrder')
  handleGetOrderChange(value: Partial<IOrderData> | undefined) {
    console.log('EM1')
    if (!isEmptyValue(value) && value) {
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValuesOfContainer', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        attributes: [{
          columnName: 'C_BPartner_ID',
          value: value.businessPartner!.id
        },
        {
          columnName: 'DisplayColumn_C_BPartner_ID',
          value: value.businessPartner!.name
        },
        {
          columnName: ' C_BPartner_ID_UUID',
          value: value.businessPartner!.uuid
        }]

      })
    }
  }

  @Watch('currentOrder')
  handleCurrentOrderChange(value: any): void {
    console.log('currentOrder value')
    console.log(value)
    if (!value) {
      this.orderLines = []
      this.$store.dispatch(Namespaces.OrderLines + '/' + 'listOrderLine', [])
      this.listOrderLines({})
    } else {
      this.listOrderLines(value)
    }
  }

    /**
     * Used when loading/reloading the app without the order uuid
     * @param {oject|boolean} bPartnerToSet
     */
    @Watch('isSetTemplateBP')
  handleIsSetTemplateBPChange(bPartnerToSet: boolean | any) {
    if (bPartnerToSet) {
      this.setBusinessPartner(bPartnerToSet)
    }
  }

    @Watch('updateOrderProcessPos')
    handleUpdateOrderProcessPos(value: boolean) {
      if (!value && this.$route.query) {
        this.reloadOrder(true)
      }
    }

    @Watch('currentPoint')
    hanldeCurrentPoint(value: IPointOfSalesData | undefined) {
      if (value) {
        this.$store.dispatch(Namespaces.PointOfSales + '/' + 'setCurrentPOS', value)
      }
    }

    // Methods
    formatDate = formatDate

    formatPrice = formatPrice

    formatQuantity = formatQuantity

    withoutPOSTerminal(): boolean {
      if (!this.currentPoint) {
        this.$message({
          type: 'warning',
          message: 'Without POS Terminal',
          showClose: true
        })
        return true
      }
      return false
    }

    arrowTop(): void {
      if (this.currentTable > 0) {
        this.currentTable--
            this.linesTable!.setCurrentRow(
              this.listOrderLine[this.currentTable]
            )
            this.currentOrderLine = this.listOrderLine[this.currentTable]
      }
    }

    arrowBottom(): void {
      const top = this.listOrderLine.length - 1
      if (this.currentTable < top) {
        this.currentTable++
            this.linesTable!.setCurrentRow(
              this.listOrderLine[this.currentTable]
            )
            this.currentOrderLine = this.listOrderLine[this.currentTable]
      }
    }

    updateOrder(update: any): void {
      if (update.value !== this.getOrder?.businessPartner?.uuid && this.currentPoint) {
        this.$store.dispatch(Namespaces.Order + '/' + 'updateOrder', {
          orderUuid: this.$route.query.action,
          posUuid: this.currentPoint?.uuid,
          customerUuid: update.value
        })
      }
    }

    setBusinessPartner(
      params:
            | { name: string, id: number, uuid: string }
            | IBusinessPartnerData
    ): void {
      const { name, id, uuid } = params
      // Use update values of container (without subscription)
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValuesOfContainer', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        attributes: [
          {
            key: 'C_BPartner_ID',
            value: id
          },
          {
            key: 'DisplayColumn_C_BPartner_ID',
            value: name
          },
          {
            key: ' C_BPartner_ID_UUID',
            value: uuid
          }
        ]
      })
    }

    findProduct(searchValue: any) {
      if (this.withoutPOSTerminal()) {
        return
      }

      const searchProduct =
            typeof searchValue === 'object' ? searchValue.value : searchValue

      findProduct({
        searchValue: searchProduct,
        priceListUuid: this.priceListUuid
      })
        .then((productPrice: IProductPriceData) => {
          this.product = productPrice.product
          this.createOrder(true)
        })
        .catch(error => {
          console.warn(error.message)
          this.$message({
            type: 'info',
            message: error.message,
            showClose: true
          })

          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            containerUuid: 'Products-Price-List',
            columnName: 'ProductValue',
            value: `${searchProduct}`
          })

          this.$store.commit(Namespaces.ListProductPrice + '/' + 'showListProductPrice', {
            attribute: 'isShowPopoverField',
            isShowed: true
          })
        })
        .finally(() => {
          console.log('EM3')
          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValuesOfContainer', {
            containerUuid: this.metadata.containerUuid,
            attributes: [
              {
                key: 'ProductValue',
                value: undefined
              }
            ]
          })
        })
    }

    createOrder(withLine: boolean) {
      if (this.withoutPOSTerminal()) {
        return
      }
      const orderUuid = this.$route.query.action
      if (!orderUuid) {
        const posUuid = this.currentPoint!.uuid

        let customerUuid: string = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
          containerUuid: this.containerUuid,
          columnName: 'C_BPartner_ID_UUID'
        })
        const id = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
          containerUuid: this.containerUuid,
          columnName: 'C_BPartner_ID'
        })
        if (!customerUuid || id === 1000006) {
          customerUuid = this.currentPoint!.templateBusinessPartner.uuid
        }

        // user session

        this.$store.dispatch(Namespaces.Order + '/' + 'createOrder', {
          posUuid: posUuid!,
          customerUuid,
          salesRepresentativeUuid: this.currentPoint?.templateBusinessPartner.uuid
        })
          .then((response: Partial<IOrderData>) => {
            this.reloadOrder(true, response.uuid)

            this.$router
              .push({
                params: {
                  ...this.$route.params
                },
                query: {
                  ...this.$route.query,
                  action: response.uuid
                }
              })
              .then(() => {
                if (withLine) {
                  this.createOrderLine(response.uuid!)
                }
                this.$store.dispatch(Namespaces.Order + '/' + 'listOrdersFromServer', {
                  posUuid: this.currentPoint?.uuid // this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS'].uuid
                })
              })
              .catch((error) => {
                console.log(error)
              })
          })
      } else {
        this.createOrderLine(orderUuid.toString())
      }
    }

    reloadOrder(requery?: any, orderUuid?: string): void {
      if (requery) {
        if (!orderUuid) {
          orderUuid = this.$route.query.action.toString()
          // if (!orderUuid) {
          //   orderUuid = this.$store.getters[Namespaces.Order + '/' + 'getOrder'].uuid // this.currentOrder.uuid
          // }
        }

        if (orderUuid) {
          this.$store.dispatch(Namespaces.Order + '/' + 'reloadOrder', {
            orderUuid
          })
        }
      }
    }

    fillOrder(order: IOrderData, setToStore = true): void {
      const orderToPush: IOrderData = {
        uuid: order.uuid,
        id: order.id,
        businessPartner: order.businessPartner, // description, duns, id, lastName, naics, name, taxId, uuid, value
        documentNo: order.documentNo,
        dateOrdered: order.dateOrdered,
        documentStatus: order.documentStatus, // value, name, description
        documentType: order.documentType, // name, printName
        salesRepresentative: order.salesRepresentative, // id, uuid, name, description,
        totalLines: order.totalLines,
        grandTotal: order.grandTotal
      }
      if (setToStore) {
        this.$store.dispatch(Namespaces.Order + '/' + 'setOrder', {
          ...orderToPush
        })
      }
      if (order.businessPartner) {
        const { businessPartner } = order
        this.setBusinessPartner(businessPartner)
      }
      // this.order = orderToPush
    }

    getOrderTax(currency: any): string | undefined {
      return this.formatPrice(this.getOrder!.grandTotal! - this.getOrder!.totalLines!, currency
      )
    }

    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        console.log('subscribe changes')
        console.log(mutation)
        console.log(state)
        // TODO: Add container uuid comparison
        if (mutation.type === Namespaces.Event + '/' + 'addActionKeyPerformed') {
          switch (mutation.payload.columnName) {
            case 'ProductValue':
              this.findProduct(mutation.payload.value)
              break
          }
        } else if (mutation.type === Namespaces.Event + '/' + 'addActionPerformed') {
          switch (mutation.payload.columnName) {
            case 'QtyEntered':
            case 'PriceEntered':
            case 'Discount':
              if (this.currentOrderLine) {
                this.updateOrderLine(mutation.payload)
              }
              break
          }
        } else if (mutation.type === Namespaces.FieldValue + '/' + 'updateValueOfField') {
          switch (mutation.payload.columnName) {
            case 'DisplayColumn_TenderType':
              this.displayType = mutation.payload.value
              break

            case 'C_BPartner_ID_UUID': {
              const bPartnerValue = mutation.payload.value
              if (this.currentPoint) {
                const bPartnerPOS = this.currentPoint!.templateBusinessPartner.uuid
                // Does not send values to server, when empty values are set or
                // if BPartner set equal to BPartner POS template
                if (!bPartnerValue || bPartnerValue === bPartnerPOS) {
                  break
                }
              }

              this.updateOrder(mutation.payload)
              break
            }
          }
        }
      })
    }

    createOrderLine(orderUuid: string) {
      const productUuid = this.product.uuid
      requestCreateOrderLine({
        orderUuid,
        productUuid
      })
        .then((orderLine: IOrderLineData) => {
          this.fillOrderLine(orderLine)
          this.reloadOrder(true, orderUuid)
        })
        .catch(error => {
          console.warn(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    }

    listOrderLines(params: { uuid?: string }) {
      const { uuid: orderUuid } = params
      console.log(orderUuid)
      if (!isEmptyValue(orderUuid)) {
        this.$store.dispatch(Namespaces.OrderLines + '/' + 'listOrderLinesFromServer', orderUuid)
        this.orderLines = this.listOrderLine
        this.handleCurrentLineChange(this.currentOrderLine)
      }
    }

    fillOrderLine(orderLine: Partial<IOrderLineDataExtended> | Partial<IOrderLineData>) {
      this.$store.dispatch(Namespaces.OrderLines + '/' + 'updateOrderLines', orderLine)
    }

    handleCurrentLineChange(rowLine: any) {
      if (rowLine) {
        this.currentOrderLine = rowLine
        this.currentTable = this.listOrderLine.findIndex(item => item.uuid === rowLine.uuid)
        if (!this.currentOrderLine && this.listOrderLine) {
            this.linesTable!.setCurrentRow(this.listOrderLine[this.currentTable])
            // this.$refs.linesTable.setCurrentRow(this.listOrderLine[this.currentTable])
        }
      }
    }

    updateOrderLine(line: any) {
      let {
        currentPrice: price,
        discount: discountRate,
        quantityOrdered: quantity
      } = this.currentOrderLine

      switch (line.columnName) {
        case 'QtyEntered':
          quantity = line.value
          break
        case 'PriceEntered':
          price = line.value
          break
        case 'Discount':
          discountRate = line.value
          break
      }

      requestUpdateOrderLine({
        orderLineUuid: this.currentOrderLine.uuid,
        quantity,
        price,
        discountRate
      })
        .then((response: IOrderLineData) => {
          this.fillOrderLine(response)
          this.reloadOrder(true)
        })
        .catch(error => {
          console.error(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    }

    mas(): void {
      this.linesTable?.setCurrentRow(this.listOrderLine[1])
    }

    menos(): void {
      this.linesTable?.setCurrentRow(this.listOrderLine[0])
    }

    shortcutKeyMethod(event: any): void {
      console.log(event.srcKey)
      switch (event.srcKey) {
        // case 'options':
        case 'up':
          this.arrowTop()
          break
        case 'popoverConvet':
          this.seeConversion = !this.seeConversion
          break
        case 'down':
          this.arrowBottom()
          break
        case 'plus':
          requestUpdateOrderLine({
            orderLineUuid: this.currentOrderLine.uuid,
            quantity: this.listOrderLine[this.currentTable].quantity + 1
          })
            .then(response => {
              this.fillOrderLine(response)
              this.reloadOrder(true)
            })
            .catch(error => {
              console.error(error.message)
              this.$message({
                type: 'error',
                message: error.message,
                showClose: true
              })
            })

          break
        case 'minus':
          requestUpdateOrderLine({
            orderLineUuid: this.currentOrderLine.uuid,
            quantity: this.listOrderLine[this.currentTable].quantity - 1
          })
            .then((response: IOrderLineData) => {
              this.fillOrderLine(response)
              this.reloadOrder(true)
            })
            .catch(error => {
              console.error(error.message)
              this.$message({
                type: 'error',
                message: error.message,
                showClose: true
              })
            })
          break
      }
    }

    // Hooks
    created() {
      this.getPanel()
    }

    mounted() {
      if (this.$route.query && this.$route.query.action) {
        const orderUuid: string | undefined = this.$route.query.action as string
        this.reloadOrder(true, orderUuid)
        if (this.$route.query.pos && this.allOrderLines && !this.$route.query.action) {
          this.$router.push({
            params: {
              ...this.$route.params
            },
            query: {
              ...this.$route.query,
              action: this.getOrder?.uuid
            }
          })
        }
      }
    }

    beforeMount() {
      if (!isEmptyValue(this.currentPoint)) {
        if (!isEmptyValue(this.currentOrder)) {
          this.listOrderLines(<IOrderData> this.currentOrder)
        }
      }
      this.unsubscribe = this.subscribeChanges()
    }

    beforeDestroy() {
      this.unsubscribe()
    }
}
