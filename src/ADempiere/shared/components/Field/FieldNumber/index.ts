import {
  FIELDS_CURRENCY,
  FIELDS_DECIMALS
} from '@/ADempiere/shared/utils/references'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { calculationValue, clearVariables } from '@/ADempiere/shared/utils/valueUtils'
import { NumberFormatOptions } from 'vue-i18n'
import { Component, Mixins } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import Template from './template.vue'

@Component({
  name: 'FieldNumber',
  mixins: [Template, MixinField]
})
export default class FieldNumber extends Mixins(MixinField) {
    public showControls = true
    public isFocus = false
    public operation = ''
    // eslint-disable-next-line
    public expression: RegExp = new RegExp(/[\d\/.()%\*\+\-]/gim)
    public valueToDisplay = ''
    public isShowed = false

    // Computed properties
    get cssClassStyle(): string {
      let styleClass = ' custom-field-number '
      if (this.metadata.cssClassName) {
        styleClass += this.metadata.cssClassName
      }
      return styleClass
    }

    get maxValue(): number {
      if (!this.metadata.valueMax) {
        return Infinity
      }
      return Number(this.metadata.valueMax)
    }

    get minValue(): number {
      if (!this.metadata.valueMin) {
        return -Infinity
      }
      return Number(this.metadata.valueMin)
    }

    get currencyDefinition(): {
        standardPrecision: number
        iSOCode: string
        } {
      return this.$store.getters[Namespaces.System + '/' + 'getCurrency']
    }

    get precision() {
      // Amount, Costs+Prices, Number
      if (this.isDecimal) {
        return this.currencyDefinition.standardPrecision
      }
      return undefined
    }

    get isShowControls(): boolean {
      if (this.metadata.showControl) {
        if (this.metadata.showControl === 0) {
          return false
        }
      }
      return true
    }

    get controlsPosition(): 'right' | undefined {
      if (this.metadata.showControl) {
        // show side controls
        if (this.metadata.showControl === 1) {
          return undefined
        }
      }
      // show right controls
      return 'right'
    }

    get isDecimal(): boolean {
      return FIELDS_DECIMALS.includes(this.metadata.displayType)
    }

    get isCurrency(): boolean {
      return FIELDS_CURRENCY.includes(this.metadata.displayType)
    }

    get displayedValue(): string | number {
      let value: number = this.value
      if (!value) {
        value = 0
      }
      if (!this.isDecimal) {
        return value
      }

      let options: NumberFormatOptions = {
        useGrouping: true,
        minimumIntegerDigits: 1,
        minimumFractionDigits: this.precision,
        maximumFractionDigits: this.precision
      }
      let lang: any
      if (this.isCurrency) {
        lang = this.countryLanguage
        options = {
          ...options,
          style: 'currency',
          currency: this.currencyCode
        }
      }

      // TODO: Check the grouping of thousands
      const formatterInstance = new Intl.NumberFormat(lang, options)
      return formatterInstance.format(value)
    }

    get countryLanguage(): string {
      return this.$store.getters[
        Namespaces.System + '/' + 'getCountryLanguage'
      ]
    }

    get currencyCode(): string {
      return this.currencyDefinition.iSOCode
    }

    // Methods
    parseValue(value: any): number | undefined {
      if (!value) {
        return undefined
      }
      return Number(value)
    }

    customFocusGained(event: any): void {
      this.isFocus = true
      // this.focusGained(event)

      this.$nextTick(() => {
        this.metadata.columnName.focus()
      })
    }

    customFocusLost(event: any): void {
      this.isFocus = false
      // this.focusLost(event)
    }

    calculateValue(event: any): void {
      const isAllowed = event.key.match(this.expression)
      if (isAllowed) {
        const result = calculationValue(this.value, event)
        if (result) {
          this.valueToDisplay = result
          this.isShowed = true
        } else {
          this.valueToDisplay = '...'
          this.isShowed = true
        }
      } else if (!isAllowed && event.key === 'Backspace') {
        if (String(this.value).slice(0, -1).length > 0) {
          event.preventDefault()
          const newValue = String(this.value).slice(0, -1)
          const result = calculationValue(newValue, event)
          if (result) {
            this.value = this.parseValue(result)
            this.valueToDisplay = result
            this.isShowed = true
          } else {
            this.valueToDisplay = '...'
            this.isShowed = true
          }
        }
      } else if (!isAllowed && event.key === 'Delete') {
        if (String(this.value).slice(-1).length > 0) {
          event.preventDefault()
          const newValue = String(this.value).slice(-1)
          const result = calculationValue(newValue, event)
          if (result) {
            this.value = this.parseValue(result)
            this.valueToDisplay = result
            this.isShowed = true
          } else {
            this.valueToDisplay = '...'
            this.isShowed = true
          }
        }
      } else {
        event.preventDefault()
      }
    }

    changeValue(): void {
      if (this.valueToDisplay && this.valueToDisplay !== '...') {
        const result = this.parseValue(this.valueToDisplay)
        this.preHandleChange(result)
      }
      clearVariables()
      this.isShowed = false
    }
}
