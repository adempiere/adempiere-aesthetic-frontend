import { ID, INTEGER } from '@/ADempiere/shared/utils/references'
import { IKeyValueObject } from '@/ADempiere/shared/utils/types'
import { calculationValue } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import calculatorRows, { ICalculatorObject } from './calculatorRows'
import Template from './template.vue'

@Component({
  name: 'FieldCalc',
  mixins: [Template]
})
export default class FieldCalc extends Vue {
    @Prop({ type: Object, required: true }) fieldAttributes!: any
    @Ref() readonly calculatorInput!: HTMLElement
    @Prop({ type: Number, default: undefined }) fieldValue?: number = undefined
    public calcValue?: any = this.fieldValue
    public valueToDisplay = ''
    public tableData: ICalculatorObject[] = calculatorRows

    // Watchers
    @Watch('fieldValue')
    handleFieldValueChange(value: number) {
      this.calcValue = value
    }

    // Methods
    sendValue(row: IKeyValueObject, column: any): void {
      const isAcceptedType: boolean = ['result', 'clear'].includes(row[column.property].type)
      if (!isAcceptedType && !this.isDisabled(row, column)) {
        !this.calcValue ? this.calcValue = row[column.property].value : this.calcValue += row[column.property].value
        const result = calculationValue(this.calcValue, event)
        if (result) {
          this.valueToDisplay = result
        } else {
          this.valueToDisplay = '...'
        }
      }
      if (row[column.property].type === 'clear') {
        if (row[column.property].value === 'C') {
          this.calcValue = this.calcValue.slice(0, -1)
        } else if (row[column.property].value === 'AC') {
          this.calcValue = ''
          this.valueToDisplay = ''
        }
      }
      if (row[column.property].value === '=') {
        this.changeValue()
      }
    }

    changeValue(): void {
      // const newValue = Number(this.valueToDisplay)
      // let isSendCallout = true
      // const isSendToServer = true
      // const isChangedOldValue = false
      // if (this.fieldAttributes.isAdvancedQuery) {
      //   isSendCallout = false
      // }
      //
      // const sendParameters = {
      //   parentUuid: this.fieldAttributes.parentUuid,
      //   containerUuid: this.fieldAttributes.containerUuid,
      //   field: this.fieldAttributes,
      //   panelType: this.fieldAttributes.panelType,
      //   columnName: this.fieldAttributes.columnName,
      //   newValue,
      //   isAdvancedQuery: this.fieldAttributes.isAdvancedQuery,
      //   isSendToServer,
      //   isSendCallout,
      //   isChangedOldValue
      // }
      // this.$store.dispatch('notifyFieldChange', {
      //   ...sendParameters
      // })
      //   .finally(() => {
      //     this.clearVariables()
      //     this.$children[0].visible = false
      //   })
    }

    spanMethod(params: { row: IKeyValueObject, column: any, rowIndex: number, columnIndex: number }): {
        rowspan: number
        colspan: number
      } | undefined {
      const { row, column, rowIndex, columnIndex } = params
      if (rowIndex === 1) {
        if (row[column.property].value === '+') {
          return {
            rowspan: 2,
            colspan: 1
          }
        }
      } else if (rowIndex === 2) {
        if (!row[column.property].value) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else if (rowIndex === 3) {
        if (row[column.property].value === '=') {
          return {
            rowspan: 2,
            colspan: 1
          }
        }
      } else if (rowIndex === 4) {
        if (row[column.property].value === '0') {
          return {
            rowspan: 1,
            colspan: 2
          }
        } else if (!row[column.property].value) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }

    isDisabled(row: IKeyValueObject, column: any): boolean {
      // Integer or ID
      const isInteger: boolean = [ID.id, INTEGER.id].includes(this.fieldAttributes.displayType)
      const value = row[column.property].value
      if (isInteger && value === ',') {
        return true
      }
      return false
    }

    calculateValue(event: any): void {
      const result = calculationValue(this.fieldValue, event)
      if (result) {
        this.valueToDisplay = result
      } else {
        this.valueToDisplay = '...'
      }
    }

    focusCalc() {
      this.calculatorInput.focus()
    }
}
