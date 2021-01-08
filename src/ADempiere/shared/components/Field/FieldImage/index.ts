import { Component, Mixins } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import Template from './template.vue'

@Component({
  name: 'FieldImage',
  mixins: [Template, MixinField]
})
export default class FieldImage extends Mixins(MixinField) {
  // Computed properties
  get cssClassStyle(): string {
    let styleClass = ' custom-field-image '
    if (this.metadata.cssClassName) {
      styleClass += this.metadata.cssClassName
    }
    return styleClass
  }

  // Methods
  handleAvatarSuccess(file: any): void {
    this.value = URL.createObjectURL(file.raw)
    // TODO: define one method to control change value
    this.handleFieldChange({ value: this.value })
  }

  beforeAvatarUpload(file: any): boolean {
    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'
    // const isGIF = file.type === 'image/gif'
    // const isBMP = file.type === 'image/bmp'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isLt2M) {
      this.$message.error(this.$t('components.imageError').toString())
    }
    return isJPG && isPNG && isLt2M
  }
}
