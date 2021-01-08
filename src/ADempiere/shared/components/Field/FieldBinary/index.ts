import { Component, Mixins } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import Template from './template.vue'

@Component({
  name: 'FieldBinary',
  mixins: [MixinField, Template]
})
export default class FieldBinary extends Mixins(MixinField) {
  // Computed properties
  get cssClassStyle(): string {
    let styleClass = ' image-uploader '
    if (this.metadata.cssClassName) {
      styleClass += this.metadata.cssClassName
    }
    return styleClass
  }

  // Methods
  handleRemove(file: any): void {
    this.$message.success('The previously uploaded file has been deleted.')
  }

  handleError(file: any): void {
    this.$message.error('The file does not meet the specifications.')
  }

  handleSuccess(file: any): void {
    this.$message.success('The file has been successfully loaded.')
  }
}
