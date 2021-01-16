import Template from './template.vue'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import MixinFieldText from '../Mixin/MixinFieldText'
import { TEXT } from '@/ADempiere/shared/utils/references'

@Component({
  name: 'FieldText',
  mixins: [Template, MixinField, MixinFieldText]
})
export default class FieldText extends Mixins(MixinField, MixinFieldText) {
    @Prop({ type: Boolean, default: false }) inTable = false
    @Prop({ type: String, default: undefined }) pattern?: string = undefined
    public patternFileName = '[A-Za-zñÑ0-9-_]{1,}'
    public patternFilePath = '[A-Za-zñÑ0-9-_/.]{1,}'

    // Computed properties
    get cssClassStyle(): string {
      let styleClass = ' custom-field-text '
      if (this.metadata.cssClassName) {
        styleClass += this.metadata.cssClassName
      }
      return styleClass
    }

    // Only used when input type='TextArea'
    get rows(): number {
      if (this.metadata.inTable) {
        return 1
      }
      return 4
    }

    get typeTextBox(): string {
      // String, Url, FileName...
      let typeInput = 'text'
      // Display Type 'Text' (14)
      if (this.metadata.displayType === TEXT.id) {
        typeInput = 'textarea'
      }
      if (this.metadata.isEncrypted) {
        typeInput = 'password'
      }
      return typeInput
    }

    get inputSize(): string {
      if (!this.metadata.inputSize) {
        return 'medium'
      }
      return this.metadata.inputSize
    }

    get maxLength(): number | undefined {
      if (this.metadata.fieldLength && this.metadata.fieldLength > 0) {
        return Number(this.metadata.fieldLength)
      }
      return undefined
    }
}
