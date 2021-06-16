import {
  IBusinessPartnerData,
  ICurrencyData,
  IProductPriceData,
  getProductPrice as findProduct
} from '@/ADempiere/modules/core'
import {
  ICurrentOrderData,
  ICurrentPointOfSalesData,
  IListOrderItemData,
  IOrderData,
  IOrderLineData,
  IOrderLineDataExtended,
  OrderLinesState,
  createOrderLine,
  updateOrderLine
} from '@/ADempiere/modules/pos'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Prop, Ref, Watch, Mixins } from 'vue-property-decorator'
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
    // @Prop({ type: Object, required: false }) metadata?: any
    @Ref() readonly linesTable?: Table
    // eslint-disable-next-line
    public unsubscribe: Function = () => {}
    public product: any = {}

    public currentTable = 0

    public orderLines: any[] = []
    public products: any = {
      uuid: '',
      quantityAvailable: 0
    }

    // Partial<IOrderLineDataExtended>
    public currentOrderLine: any = {
      product: {
        value: (0 as any),
        name: '',
        description: '',
        priceStandard: 0
      },
      taxIndicator: (0 as any),
      quantityOrdered: 0,
      uuid: ''
    }

    public edit = false
    public displayType = ''
    // public containerUuid?: string
    public parentUuid?: string
  seeConversion: any

  // Computed properties
  get currentPointOfSales(): ICurrentPointOfSalesData {
    return this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'].currentPointOfSales
  }

  // Currency Point Of Sales
  get pointOfSalesCurrency(): ICurrencyData | Partial<ICurrencyData> {
    // const currency = this.currentPointOfSales
    if (!isEmptyValue(this.currentPointOfSales.priceList)) {
      return {
        ...this.currentPointOfSales.priceList!.currency,
        amountConvertion: 1
      }
    }
    return {
      uuid: '',
      iSOCode: '',
      curSymbol: '',
      amountConvertion: 1
    }
  }

  get listPointOfSales() {
    return this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'].listPointOfSales
  }

  get ordersList(): IListOrderItemData | IOrderData[] {
    if (isEmptyValue(this.currentPointOfSales)) {
      return []
    }
    return this.currentPointOfSales.listOrder
  }

  get currentOrder(): ICurrentOrderData | Partial<ICurrentOrderData> {
    if (isEmptyValue(this.currentPointOfSales)) {
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
    return this.currentPointOfSales.currentOrder
  }

  get isDisabled(): boolean {
    return this.currentPointOfSales.currentOrder.isProcessed
  }

  get listOrderLine(): IOrderLineDataExtended[] {
    if (isEmptyValue(this.currentOrder)) {
      return []
    }
    return (this.currentOrder as ICurrentOrderData).lineOrder
  }

  get getWarehouse() {
    return this.$store.getters[Namespaces.User + '/' + 'getWarehouse']
  }

  get currentPoint() {
    return this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'].currentPointOfSales
  }

  get isSetTemplateBP(): IBusinessPartnerData | false {
    const currentPOS = this.currentPointOfSales
    if (
      currentPOS &&
            !isEmptyValue(currentPOS.templateBusinessPartner) &&
            isEmptyValue(this.$route.query.action)
    ) {
      return currentPOS.templateBusinessPartner!
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
    @Watch('currentOrder')
  handleGetOrderChange(value: Partial<IOrderData> | undefined) {
    if (isEmptyValue(value)) {
      this.orderLines = []
      this.$store.dispatch(Namespaces.OrderLines + '/' + 'listOrderLine', [])
      this.listOrderLines({})
    } else {
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValuesOfContainer', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        attributes: [{
          columnName: 'C_BPartner_ID',
          value: value!.businessPartner!.id
        },
        {
          columnName: 'DisplayColumn_C_BPartner_ID',
          value: value!.businessPartner!.name
        },
        {
          columnName: ' C_BPartner_ID_UUID',
          value: value!.businessPartner!.uuid
        }]

      })
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
      if (isEmptyValue(this.currentPointOfSales)) {
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
      if (!isEmptyValue(update.value) && update.value !== this.currentOrder?.businessPartner?.uuid && !isEmptyValue(this.currentPointOfSales)) {
        this.$store.dispatch(Namespaces.Order + '/' + 'updateOrder', {
          orderUuid: this.$route.query.action,
          posUuid: this.currentPointOfSales?.uuid,
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
        priceListUuid: this.currentPointOfSales.priceList?.uuid
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

          this.$store.commit(Namespaces.ProductPrice + '/' + 'showListProductPrice', {
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
      if (isEmptyValue(orderUuid)) {
        const posUuid = this.currentPointOfSales.uuid

        let customerUuid: string = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
          containerUuid: this.metadata.containerUuid,
          columnName: 'C_BPartner_ID_UUID'
        })
        const id = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
          containerUuid: this.metadata.containerUuid,
          columnName: 'C_BPartner_ID'
        })
        if (isEmptyValue(customerUuid) || id === 1000006) {
          customerUuid = this.currentPointOfSales!.templateBusinessPartner!.uuid
        }

        // user session

        this.$store.dispatch(Namespaces.Order + '/' + 'createOrder', {
          posUuid: posUuid!,
          customerUuid,
          salesRepresentativeUuid: this.currentPointOfSales!.salesRepresentative!.uuid
        })
          .then((response: Partial<IOrderData>) => {
            this.reloadOrder(true, response.uuid)

            this.$router.push({
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
                  posUuid: this.currentPointOfSales?.uuid // this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS'].uuid
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
        if (isEmptyValue(orderUuid)) {
          orderUuid = this.$route.query.action.toString()
          // if (!orderUuid) {
          //   orderUuid = this.$store.getters[Namespaces.Order + '/' + 'getOrder'].uuid // this.currentOrder.uuid
          // }
        }

        if (!isEmptyValue(orderUuid)) {
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
      return this.formatPrice(this.currentOrder!.grandTotal! - this.currentOrder!.totalLines!, currency
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
              if (!isEmptyValue((this.$store.state[Namespaces.OrderLines] as OrderLinesState).line)) {
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
              if (!isEmptyValue(this.currentPointOfSales)) {
                const bPartnerPOS = this.currentPointOfSales.templateBusinessPartner!.uuid
                // Does not send values to server, when empty values are set or
                // if BPartner set equal to BPartner POS template
                if (isEmptyValue(bPartnerValue) || bPartnerValue === bPartnerPOS) {
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
      createOrderLine({
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
        this.orderLines = this.listOrderLine
        this.handleCurrentLineChange(this.currentOrderLine)
      }
    }

    fillOrderLine(orderLine: Partial<IOrderLineDataExtended> | Partial<IOrderLineData>) {
      this.$store.dispatch(Namespaces.OrderLines + '/' + 'updateOrderLines', orderLine)
    }

    handleCurrentLineChange(rowLine: any) {
      if (!isEmptyValue(rowLine)) {
        this.$store.dispatch(Namespaces.OrderLines + '/' + 'currentLine', rowLine)
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

      updateOrderLine({
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
          updateOrderLine({
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
          updateOrderLine({
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

    newOrder() {
      this.$router.push({
        params: {
          ...this.$route.params
        },
        query: {
          pos: (this.currentPointOfSales.id as any)
        }
      }).catch(() => {
      }).finally(() => {
        this.$store.commit(Namespaces.OrderLines + '/' + 'setListPayments', [])
        const { templateBusinessPartner } = this.currentPointOfSales
        this.$store.commit(Namespaces.FieldValue + '/' + 'updateValuesOfContainer', {
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
            value: templateBusinessPartner!.id
          },
          {
            columnName: 'DisplayColumn_C_BPartner_ID',
            value: templateBusinessPartner!.name
          },
          {
            columnName: ' C_BPartner_ID_UUID',
            value: templateBusinessPartner!.uuid
          }]
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
        this.$store.commit(Namespaces.PointOfSales + '/' + 'setShowPOSCollection', false)
        this.$store.dispatch(Namespaces.OrderLines + '/' + 'listOrderLine', [])
      })
    }

    changePos(posElement: ICurrentPointOfSalesData) {
      this.$store.dispatch(Namespaces.PointOfSales + '/' + 'setCurrentPOS', posElement)
      this.newOrder()
    }

    beforeMount() {
      this.unsubscribe = this.subscribeChanges()
    }

    beforeDestroy() {
      this.unsubscribe()
    }
}
