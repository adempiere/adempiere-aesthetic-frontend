import { Component, Mixins, Prop } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import Template from './template.vue'
import { getResource, updateResource } from '@/ADempiere/modules/field/FieldService/binary'
import { KeyValueData } from '@/ADempiere/modules/persistence'
import { IValueData } from '@/ADempiere/modules/core'
import { MessageType } from 'element-ui/types/message'
import { IValuesImageData } from '@/ADempiere/shared/utils/types'

@Component({
  name: 'FieldImage',
  mixins: [Template, MixinField]
})
export default class FieldImage extends Mixins(MixinField) {
  @Prop({ type: Array, default: () => [] }) binary!: KeyValueData<IValueData>[]
  // Data
  private valuesImage: IValuesImageData[] = [{
    identifier: 'undefined',
    value: '',
    isLoaded: true
  }]

  // Computed properties
  get cssClassStyle(): string {
    let styleClass = ' custom-field-image '
    if (this.metadata.cssClassName) {
      styleClass += this.metadata.cssClassName
    }
    return styleClass
  }

  // Methods
  updateResource = updateResource
  getResource = getResource

  handleChange(file: any, fileList?: any) {
    let message = ''; let type: MessageType = file.status
    this.binary.push({
      key: this.metadata.columnName,
      value: file
    })
    switch (file.status) {
      case 'success':
        message = 'succesful'
        type = file.status
        break
      case 'ready':
        message = 'loading'
        type = 'loading' as MessageType
        break
      case 'error':
        message = file.status
        type = file.status
        break
    }
    if (type) {
      this.$message({
        type: type,
        showClose: true,
        message: this.$t('notifications.' + message).toString()
      })
    }
    updateResource({
      uuid: this.metadata.recordUuid,
      tableName: this.$route.params.tableName,
      binaryFile: this.binary
    })
  }

  handleAvatarSuccess(file: any): void {
    this.value = URL.createObjectURL(file.raw)
    // TODO: define one method to control change value
    this.handleFieldChange({ value: this.value })
    getResource({
      uuid: this.metadata.recordUuid,
      tableName: this.$route.params.tableName
    })
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
