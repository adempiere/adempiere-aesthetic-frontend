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
  requestCreateOrder,
  requestCreateOrderLine,
  requestGetOrder,
  requestUpdateOrder,
  requestUpdateOrderLine
} from '@/ADempiere/modules/pos'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Mixins, Prop, Ref, Watch } from 'vue-property-decorator'
import {
  formatPrice,
  formatQuantity,
  formatDate
} from '@/ADempiere/shared/utils/valueFormat'
import { Table } from 'element-ui'
import MixinForm from '../MixinForm'

@Component({
  name: 'MixinPOS',
  mixins: [MixinForm]
})
export default class MixinPOS extends Mixins(MixinForm) {
    @Prop({ type: Object, required: true }) metadata!: any
    @Ref() readonly linesTable?: Table
    // eslint-disable-next-line
    public unsubscribe: Function = () => {}
    public product: any = {}
    public order: Partial<IOrderData> = {
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
    if (!this.listOrderLine) {
      return []
    }
    return this.listOrderLine
  }

  get listOrderLine(): IOrderLineDataExtended[] {
    return this.$store.getters[
      Namespaces.OrderLines + '/' + 'getListOrderLine'
    ]
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
    if (action) {
      const order = this.ordersList.find(
        (item: IOrderData) => item.uuid === action
      )
      if (order) {
        return order
      }
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
      businessPartner: undefined
    }
  }

  get currentPoint(): IPointOfSalesData | undefined {
    return this.$store.getters[
      Namespaces.PointOfSales + '/' + 'getCurrentPOS'
    ]
  }

  get priceListUuid(): string | undefined {
    const currentPOS: IPointOfSalesData | undefined = this.currentPoint
    if (!currentPOS) {
      return undefined
    }
    return this.currentPoint!.priceList.uuid
  }

  get getWarehouse() {
    return this.$store.getters['user/getWarehouse']
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

  // Watchers
  @Watch('currentOrder')
  handleCurrentOrderChange(value: any): void {
    if (!value) {
      this.orderLines = []
      this.order = {
        documentType: undefined,
        documentStatus: undefined,
        salesRepresentative: undefined
      }
      this.$store.dispatch(Namespaces.OrderLines + '/' + 'listOrderLine', [])
      this.listOrderLines({
        uuid: ''
      })
    } else {
      this.fillOrder(value)
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
      if (this.withoutPOSTerminal()) {
        return
      }
      if (!this.$route.query || !this.$route.query.action) {
        return
      }

      const { uuid: posUuid } = this.currentPoint!

      let customerUuid
      if (update.columnName === 'C_BPartner_ID_UUID') {
        customerUuid = update.value
        if (!customerUuid && this.currentPoint) {
          customerUuid = this.currentPoint!.templateBusinessPartner.uuid
        }
      }

      requestUpdateOrder({
        orderUuid: this.$route.query.action.toString(),
        posUuid: posUuid!,
        customerUuid
        // documentTypeUuid: value.value,
        // description
      })
        .then(response => {
          // this.reloadOrder(true)
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
        if (!customerUuid) {
          customerUuid = this.currentPoint!.templateBusinessPartner.uuid
        }

        // user session
        const salesRepresentativeUuid = this.$store.state.user.userUuid

        requestCreateOrder({
          posUuid: posUuid!,
          customerUuid,
          salesRepresentativeUuid
        })
          .then((order: IOrderData) => {
            this.$store.dispatch(Namespaces.Order + '/' + 'currentOrder', order)
            this.fillOrder(order)

            this.$router
              .push({
                params: {
                  ...this.$route.params
                },
                query: {
                  ...this.$route.query,
                  action: order.uuid
                }
              })
              .then(() => {
                if (withLine) {
                  this.createOrderLine(order.uuid)
                }
              })
              .catch(
                undefined
              )

            // update orders list
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
      } else {
        this.createOrderLine(orderUuid.toString())
      }
    }

    reloadOrder(requery?: any, orderUuid?: string): void {
      if (requery) {
        if (!orderUuid) {
          orderUuid = this.$route.query.action.toString()
          if (!orderUuid) {
            orderUuid = this.$store.getters[Namespaces.Order + '/' + 'getOrder'].uuid // this.currentOrder.uuid
          }
        }

        if (orderUuid) {
          requestGetOrder(orderUuid)
            .then((orderResponse: IOrderData) => {
              this.$store.dispatch(Namespaces.Order + '/' + 'currentOrder', orderResponse)
              this.fillOrder(orderResponse)
              this.listOrderLines(orderResponse)
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: error.message,
                showClose: true
              })
            })
        }
      } else {
        this.fillOrder(<IOrderData> this.currentOrder, false)
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
      this.order = orderToPush
    }

    getOrderTax(currency: any): string | undefined {
      if (!this.order) {
        return undefined
      }
      return this.formatPrice(
            this.order.grandTotal! - this.order!.totalLines!,
            currency
      )
    }

    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        // TODO: Add container uuid comparison
        if (mutation.type === 'addActionKeyPerformed') {
          switch (mutation.payload.columnName) {
            case 'ProductValue':
              this.findProduct(mutation.payload.value)
              break
          }
        } else if (mutation.type === 'addActionPerformed') {
          switch (mutation.payload.columnName) {
            case 'QtyEntered':
            case 'PriceEntered':
            case 'Discount':
              if (this.currentOrderLine) {
                this.updateOrderLine(mutation.payload)
              }
              break
              //
            case 'C_DocType_ID':
              this.updateOrder(mutation.payload)
              break
          }
        } else if (mutation.type === 'updateValueOfField') {
          // if (this.metadata.containerUuid === mutation.payload.containerUuid &&
          //   mutation.payload.columnName === 'ProductValue') {
          //   this.findProduct(mutation.payload.value)
          // }
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

    listOrderLines(params: { uuid: string }) {
      const { uuid: orderUuid } = params
      if (orderUuid) {
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
      // this,findProcess()
      if (this.$route.query) {
        const orderUuid: string | undefined = <string> this.$route.query.action
        this.reloadOrder(true, orderUuid)
      }
    }

    beforeMount() {
      if (this.currentPoint) {
        if (this.currentOrder) {
          this.fillOrder(<IOrderData> this.currentOrder)
          this.listOrderLines(<IOrderData> this.currentOrder)
        }
      }
      this.unsubscribe = this.subscribeChanges()
    }

    beforeDestroy() {
      this.unsubscribe()
    }
}
