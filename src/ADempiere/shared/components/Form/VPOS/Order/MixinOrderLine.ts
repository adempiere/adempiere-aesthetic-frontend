import { IConversionRateData, ICurrencyData, IGetConversionRateParams } from '@/ADempiere/modules/core/CoreType'
import { IOrderLineData, IPOSAttributesData, OrderLinesState, deleteOrderLine, updateOrderLine } from '@/ADempiere/modules/pos'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { formatPercent, formatPrice, formatQuantity } from '@/ADempiere/shared/utils/valueFormat'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Mixins } from 'vue-property-decorator'
import MixinPOS from '../MixinPOS'

@Component({
  name: 'MixinOrderLine',
  mixins: [MixinPOS]
})
export default class MixinOrderLine extends Mixins(MixinPOS) {
    public orderLineDefinition = {
      lineDescription: {
        columnName: 'LineDescription',
        label: this.$t('form.pos.tableProduct.product').toString(),
        isNumeric: false,
        size: '380'
      },
      currentPrice: {
        columnName: 'CurrentPrice',
        label: this.$t('form.productInfo.price').toString(),
        isNumeric: true,
        size: 'auto'
      },
      quantityOrdered: {
        columnName: 'QtyOrdered',
        label: this.$t('form.pos.tableProduct.quantity').toString(),
        isNumeric: true,
        size: '100px'
      },
      discount: {
        columnName: 'Discount',
        label: '% ' + this.$t('form.pos.order.discount').toString(),
        isNumeric: true,
        size: '110px'
      },
      grandTotal: {
        columnName: 'GrandTotal',
        label: 'Total',
        isNumeric: true,
        size: 'auto'
      },
      convertedAmount: {
        columnName: 'ConvertedAmount',
        label: this.$t('form.pos.collect.convertedAmount'),
        isNumeric: true,
        size: 'auto'
      }
    }

    public totalAmountConvertedLine: Partial<Partial<ICurrencyData> & Pick<IConversionRateData, 'amountConvertion' | 'multiplyRate'>> = {}

    // Computed properties

    get currencyPoint(): ICurrencyData | Partial<ICurrencyData> {
      const currency = this.currentPoint
      if (currency) {
        return currency.priceList.currency
      }
      return {
        uuid: '',
        iSOCode: '',
        curSymbol: ''
      }
    }

      // Methods
      formatPercent = formatPercent

      formatPrice = formatPrice

      formatQuantity = formatQuantity

      changeLine(command: any) {
        switch (command.option) {
          case 'Eliminar':
            // this.deleteOrderLine()
            break
          //
          case this.$t('form.pos.tableProduct.editQuantities').toString():
            this.fillOrderLineQuantities({
              currentPrice: this.currentOrderLine.currentPrice,
              quantityOrdered: this.currentOrderLine.quantityOrdered,
              discount: this.currentOrderLine.discount
            })
            this.currentOrderLine.uuid = command.uui
            this.edit = true
            break
          //
          case 'Información':
            break
        }
      }

      updateOrderLine(line: any) {
        let quantity, price, discountRate
        const currentLine = (this.$store.state[Namespaces.OrderLines] as OrderLinesState).line

        switch (line.columnName) {
          case 'QtyEntered':
            quantity = line.value
            price = currentLine.price
            discountRate = currentLine.discountRate
            break
          case 'PriceEntered':
            price = line.value
            quantity = currentLine.quantity
            discountRate = currentLine.discountRate
            break
          case 'Discount':
            discountRate = line.value
            price = currentLine.price
            quantity = currentLine.quantity
            break
        }

        updateOrderLine({
          orderLineUuid: currentLine.uuid,
          quantity,
          price,
          discountRate
        })
          .then((response: IOrderLineData) => {
            this.fillOrderLineQuantities({
              currentPrice: response.price,
              quantityOrdered: response.quantity,
              discount: response.discountRate
            })
            this.$store.commit(Namespaces.OrderLines + '/' + 'pin', false)
            this.fillOrderLine(response)
            this.$store.dispatch(Namespaces.Order + '/' + 'reloadOrder', {
              orderUuid: (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales.currentOrder.uuid
            })
            this.$store.dispatch(Namespaces.OrderLines + '/' + 'currentLine', response)
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

      deleteOrderLine(lineSelection: any) {
        deleteOrderLine({
          orderLineUuid: lineSelection.uuid
        })
          .then(() => {
            this.$store.dispatch(Namespaces.Order + '/' + 'reloadOrder', {
              orderUuid: (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales.currentOrder.uuid
            })
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

      /**
       * Show the correct display format
       * @param {object} row record
       * @param {object} orderLine or field definition
       */
      displayValue(row: any, orderLine: { columnName: string }) {
        const { columnName } = orderLine
        if (columnName === 'LineDescription') {
          return row.lineDescription
        }

        const currency = this.pointOfSalesCurrency.iSOCode
        if (columnName === 'CurrentPrice') {
          return this.formatPrice(row.priceActual, currency)
        } else if (columnName === 'QtyOrdered') {
          return this.formatQuantity(row.quantityOrdered)
        } else if (columnName === 'Discount') {
          return this.formatPercent(row.discount / 100)
        } else if (columnName === 'GrandTotal') {
          return this.formatPrice(row.grandTotal, currency)
        } else if (columnName === 'ConvertedAmount') {
          return this.formatPrice(this.getTotalAmount(row.grandTotal, this.totalAmountConvertedLine.multiplyRate!), this.totalAmountConvertedLine.iSOCode)
        }
      }

      productPrice(price: number, discount: number): number {
        return price / discount * 100
      }

      fillOrderLineQuantities(params: {
        currentPrice: number
        quantityOrdered: number
        discount: number
      }) {
        const { currentPrice, quantityOrdered, discount } = params
        // const containerUuid = this.formUuid
        //  Editable fields
        if (quantityOrdered) {
          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            containerUuid: 'line',
            columnName: 'QtyEntered',
            value: quantityOrdered
          })
        }
        if (currentPrice) {
          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            containerUuid: 'line',
            columnName: 'PriceEntered',
            value: currentPrice
          })
        }
        if (discount) {
          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            containerUuid: 'line',
            columnName: 'Discount',
            value: discount
          })
        }
      }

      isValidForDeleteLine(line: any): boolean {
        if (isEmptyValue(this.currentOrderLine) && !isEmptyValue(this.orderLines)) {
          this.currentOrderLine = this.orderLines[0]
        }
        return !isEmptyValue(line)
      }

      convertedAmountAsTotal(value: Partial<ICurrencyData>) {
        this.$store.dispatch(Namespaces.Payments + '/' + 'conversionDivideRate', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.pointOfSalesCurrency.uuid,
          currencyToUuid: value.uuid
        })
          .then((response: Partial<IConversionRateData>) => {
            if (!isEmptyValue(response.currencyTo)) {
              const currency: Partial<ICurrencyData> & Pick<IConversionRateData, 'amountConvertion' | 'multiplyRate'> = {
                ...response.currencyTo,
                amountConvertion: response.divideRate,
                multiplyRate: response.multiplyRate!
              }
              this.totalAmountConvertedLine = currency
            } else {
              this.totalAmountConvertedLine.multiplyRate = ('1') as any
              this.totalAmountConvertedLine.iSOCode = value.iSOCode
            }
          })
          .catch(error => {
            console.warn(`conversionDivideRate: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
          })
      }

      getTotalAmount(basePrice: number, multiplyRate: number) {
        if (isEmptyValue(basePrice) || isEmptyValue(multiplyRate)) {
          return 0
        }
        return (basePrice * multiplyRate)
      }

      // Hooks
      created() {
        const currentCurrency = (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).listPointOfSales.find((pos: any) =>
          pos.priceList.currency.uuid !== (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales.priceList!.currency.uuid)
        this.convertedAmountAsTotal(currentCurrency.priceList.currency)
      }
}
