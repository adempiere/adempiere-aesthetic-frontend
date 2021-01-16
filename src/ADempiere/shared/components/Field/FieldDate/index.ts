import { DATE_PLUS_TIME } from '@/ADempiere/shared/utils/references'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { DatePickerOptions } from 'element-ui/types/date-picker'
import { Component, Mixins } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import Template from './template.vue'

@Component({
  name: 'FieldDate',
  mixins: [MixinField, Template]
})
export default class FieldDate extends Mixins(MixinField) {
    public pickerOptionsDate: DatePickerOptions = {
      shortcuts: [{
        text: this.$t('components.date.Today').toString(),
        onClick(picker: any) {
          picker.$emit('pick', new Date())
        }
      }, {
        text: this.$t('components.date.Yesterday').toString(),
        onClick(picker: any) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24)
          picker.$emit('pick', date)
        }
      }, {
        text: this.$t('components.date.Week').toString(),
        onClick(picker: any) {
          const date = new Date()
          const monthEndDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
          picker.$emit('pick', monthEndDay)
        }
      }]
    }

      public pickerOptionsDateRange: DatePickerOptions = {
        shortcuts: [{
          text: this.$t('components.date.Yesterday').toString(),
          onClick(picker: any) {
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, start])
          }
        }, {
          text: this.$t('components.date.Week').toString(),
          onClick(picker: any) {
            const startDate = new Date()
            startDate.setHours(0, 0, 0, 0)
            const endDate = new Date()
            const date = null
            const currenDate = date ? new Date(date) : new Date()
            const first = currenDate.getDate() - currenDate.getDay() // currenDate.getDay('monday')
            const last = first - 7
            startDate.setDate(last)
            endDate.setDate(first - 1)
            picker.$emit('pick', [startDate, endDate])
          }
        }, {
          text: this.$t('components.date.LastMonth').toString(),
          onClick(picker: any) {
            const date = new Date()
            const monthEndDay = new Date(date.getFullYear(), date.getMonth(), 0)
            const monthStartDay = new Date(date.getFullYear(), date.getMonth() - 1, 1)
            picker.$emit('pick', [monthStartDay, monthEndDay])
          }
        }, {
          text: this.$t('components.date.CurrentMonth').toString(),
          onClick(picker: any) {
            const date = new Date()
            const monthEndDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
            const monthStartDay = new Date(date.getFullYear(), date.getMonth(), 1)
            picker.$emit('pick', [monthStartDay, monthEndDay])
          }
        }]
      }

      // Computed properties
      get typePicker(): string {
        let picker = 'date'
        if (['IN', 'NOT_IN'].includes(this.metadata.operator) && this.metadata.isAdvancedQuery) {
          picker += 's'
          return picker
        }
        // Date + Time reference (16)
        if (this.metadata.displayType === DATE_PLUS_TIME.id) {
          picker += 'time'
        }
        if (this.metadata.isRange && !this.metadata.inTable) {
          picker += 'range'
        }
        return picker
      }

      get cssClassStyle(): string {
        let styleClass = ' custom-field-date '
        if (this.metadata.cssClassName) {
          styleClass += this.metadata.cssClassName
        }
        return styleClass
      }

      /**
       * Parse the date format to be compatible with element-ui
       */
      get formatView(): string {
        let format = ''
        if (this.metadata.vFormat) {
          format = this.metadata.vFormat
            .replace(/[Y]/gi, 'y')
            .replace(/[m]/gi, 'M')
            .replace(/[D]/gi, 'd')
        }
        if (!format) {
          format = 'yyyy-MM-dd'
        }
        if (this.typePicker.replace('range', '') === 'datetime') {
          format = format + ' hh:mm:ss A'
        }
        return format
      }

      get formatSend(): string | undefined {
        if (this.formatView) {
          return this.formatView
            .replace(/[h]/gi, 'H')
            .replace(/[aA]/gi, '')
        }
        return undefined
      }

      get pickerOptions(): DatePickerOptions {
        if (this.typePicker === 'daterange') {
          return this.pickerOptionsDateRange
        }
        return this.pickerOptionsDate
      }

      get value(): any {
        const { columnName, containerUuid } = this.metadata

        // table records values
        if (this.metadata.inTable) {
          const row = this.$store.getters[Namespaces.BusinessData + '' + 'getRowData']({
            containerUuid,
            index: this.metadata.tableIndex
          })
          return row[columnName]
        }

        // main panel values
        let value: any = this.$store.getters[Namespaces.FieldValue + '' + 'getValueOfField']({
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName
        })
        if (!this.metadata.isRange) {
          return this.parseValue(value)
        }

        const valueTo = this.$store.getters[Namespaces.FieldValue + '' + 'getValueOfField']({
          parentUuid: this.metadata.parentUuid,
          containerUuid,
          columnName: this.metadata.columnNameTo
        })

        value = this.parseValue([value, valueTo])
        return value
      }

      set value(value: any) {
        let startValue = value
        if (Array.isArray(value)) {
          startValue = value[0]
        }
        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnName,
          value: startValue
        })
        if (!this.metadata.isRange) {
          return
        }

        const endValue = value[1]

        this.$store.commit('updateValueOfField', {
          parentUuid: this.metadata.parentUuid,
          containerUuid: this.metadata.containerUuid,
          columnName: this.metadata.columnNameTo,
          value: endValue
        })
      }

      // Methods
      parseValue(value: any) {
        // not return undefined to v-model
        if (!value) {
          if (['IN', 'NOT_IN'].includes(this.metadata.operator) && this.metadata.isAdvancedQuery) {
            return []
          }
          return null
        }

        if (['IN', 'NOT_IN'].includes(this.metadata.operator) && this.metadata.isAdvancedQuery) {
          if (Array.isArray(value)) {
            value = value.map(itemValue => {
              if (typeof itemValue === 'object') {
                return itemValue.toUTCString()
              }
              return itemValue
            })
          } else {
            const tempValue = []
            if (value) {
              tempValue.push(value)
            }
            value = tempValue
          }
          return value
        }

        // instance date from long value
        if (typeof value === 'number') {
          value = new Date(value).toUTCString()
        }

        // generate range value
        if (this.metadata.isRange && !this.metadata.inTable) {
          let valueTo // = this.metadata.valueTo
          if (Array.isArray(value)) {
            valueTo = value[1]
            value = value[0]
          }
          if (typeof valueTo === 'number') {
            valueTo = new Date(valueTo).toUTCString()
          }
          if (!valueTo) {
            valueTo = undefined
          }
          value = [value, valueTo]
          if (!value[0] || !value[1]) {
            value = []
          }
        }

        return value
      }

      // validate values before send values to store or server
      preHandleChange(value: any): void {
        let startValue, endValue
        startValue = value

        if (this.typePicker === 'dates') {
          if (Array.isArray(value)) {
            value = value.map(itemValue => new Date(itemValue))
          }
          this.handleFieldChange({ value })
          return
        }

        if (this.metadata.isRange && !this.metadata.inTable && Array.isArray(value)) {
          startValue = value[0]
          endValue = value[1]
        }

        if (startValue === null) {
          startValue = undefined
          endValue = undefined
        }

        if (typeof startValue !== 'object' && startValue !== undefined) {
          startValue = new Date(startValue)
          endValue = new Date(endValue)
        }

        this.handleFieldChange({
          value: startValue,
          valueTo: endValue
        })
      }
}
