import { ID, INTEGER } from '@/ADempiere/shared/utils/references'
import { IKeyValueObject } from '@/ADempiere/shared/utils/types'
import { calculationValue } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import calculatorRows, { ICalculatorObject } from './calculatorRows'
import buttons from './buttons'
import Template from './template.vue'

@Component({
  name: 'FieldCalc',
  mixins: [Template]
})
export default class FieldCalc extends Vue {
    @Prop({ type: Object, required: true }) fieldAttributes!: any
    @Ref() readonly calculatorInput!: HTMLElement
    @Prop({ type: Number, default: undefined }) fieldValue?: number
    // eslint-disable-next-line
    // @ts-ignore
    public calcValue?: any = this.fieldValue
    public valueToDisplay = ''

    // Computed properties
    // public tableData: ICalculatorObject[] = calculatorRows
    get tableData(): ICalculatorObject[] {
      return buttons
    }

    // Watchers
    @Watch('fieldValue')
    handleFieldValueChange(value: number) {
      this.calcValue = value
    }

    // Methods
    sendValue(row: IKeyValueObject, column: any): void {
      const button = row[column.property]
      const { value, type } = button
      const isAcceptedType: boolean = ['result', 'clear'].includes(type)
      if (!isAcceptedType && !this.isDisabled(row, column)) {
        !this.calcValue ? this.calcValue = value : this.calcValue += value
        const result = calculationValue(this.calcValue, event)
        if (result) {
          this.valueToDisplay = result
        } else {
          this.valueToDisplay = '...'
        }
      }
      if (type === 'clear') {
        if (value === 'C') {
          this.calcValue = this.calcValue.slice(0, -1)
        } else if (value === 'AC') {
          this.calcValue = ''
          this.valueToDisplay = ''
        }
      }
      if (value === '=') {
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

    spanMethod(params: { row: IKeyValueObject, column: any }): {
        rowspan: number
        colspan: number
      } | undefined {
      const { row, column } = params
      const button = row[column.property]
      const { value } = button
      if (!value) {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
      if (['+', '='].includes(value)) {
        return {
          rowspan: 2,
          colspan: 1
        }
      }
      if (value === '0') {
        return {
          rowspan: 1,
          colspan: 2
        }
      }

      return {
        rowspan: 1,
        colspan: 1
      }
    }

    isDisabled(row: IKeyValueObject, column: any): boolean {
      // Integer or ID
      const isInteger: boolean = [ID.id, INTEGER.id].includes(this.fieldAttributes.displayType)
      const { value } = row[column.property]
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
