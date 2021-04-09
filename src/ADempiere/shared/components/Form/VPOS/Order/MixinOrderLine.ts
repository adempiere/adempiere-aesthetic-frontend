import { ICurrencyData } from '@/ADempiere/modules/core/CoreType'
import { IOrderLineData, requestDeleteOrderLine, requestUpdateOrderLine } from '@/ADempiere/modules/pos'
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
        isNumeric: false
      },
      currentPrice: {
        columnName: 'CurrentPrice',
        label: this.$t('form.productInfo.price').toString(),
        isNumeric: true
      },
      quantityOrdered: {
        columnName: 'QtyOrdered',
        label: this.$t('form.pos.tableProduct.quantity').toString(),
        isNumeric: true
      },
      discount: {
        columnName: 'Discount',
        label: '% ' + this.$t('form.pos.order.discount').toString(),
        isNumeric: true
      },
      grandTotal: {
        columnName: 'GrandTotal',
        label: 'Total',
        isNumeric: true
      }
    }

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

      changeLine(command: string) {
        switch (command) {
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
            this.edit = true
            break
          //
          case 'informacion':
            break
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

      deleteOrderLine(lineSelection: any) {
        requestDeleteOrderLine({
          orderLineUuid: lineSelection.uuid
        })
          .then(() => {
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

        const currency = this.currencyPoint.iSOCode
        if (columnName === 'CurrentPrice') {
          return this.formatPrice(row.priceActual, currency)
        } else if (columnName === 'QtyOrdered') {
          return this.formatQuantity(row.quantityOrdered)
        } else if (columnName === 'Discount') {
          return this.formatPercent(row.discount)
        } else if (columnName === 'GrandTotal') {
          return this.formatPrice(row.grandTotal, currency)
        }
      }

      fillOrderLineQuantities(params: {
        currentPrice: number
        quantityOrdered: number
        discount: number
      }) {
        const { currentPrice, quantityOrdered, discount } = params
        const containerUuid = this.formUuid
        //  Editable fields
        if (quantityOrdered) {
          this.$store.commit('updateValueOfField', {
            containerUuid,
            columnName: 'QtyEntered',
            value: quantityOrdered
          })
        }
        if (currentPrice) {
          this.$store.commit('updateValueOfField', {
            containerUuid,
            columnName: 'PriceEntered',
            value: currentPrice
          })
        }
        if (discount) {
          this.$store.commit('updateValueOfField', {
            containerUuid,
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
}
