import { Component, Mixins } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import Template from './template.vue'

@Component({
  name: 'FieldTime',
  mixins: [Template, MixinField]
})
export default class FieldTime extends Mixins(MixinField) {
  // Computed properties
  get isPickerRange(): boolean {
    if (this.metadata.isRange && !this.metadata.inTable) {
      return true
    }
    return false
  }

  get maxValue(): number {
    if (this.metadata.valueMax) {
      return Number(this.metadata.valueMax)
    }
    return Infinity
  }

  get minValue(): number {
    if (this.metadata.valueMin) {
      return Number(this.metadata.valueMin)
    }
    return -Infinity
  }

  get cssClassStyle(): string {
    let styleClass = ' custom-field-time '
    if (this.metadata.cssClassName) {
      styleClass += this.metadata.cssClassName
    }
    return styleClass
  }

  // Methods
  parseValue(value: any): string {
    if (typeof value === 'number') {
      value = new Date(value).toUTCString()
    }
    if (!value) {
      value = undefined
    }
    return value
  }
}
