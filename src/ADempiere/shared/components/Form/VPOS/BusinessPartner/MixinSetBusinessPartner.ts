import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'MixinSetBusinessPartner'
})
export default class MixinSetBusinessPartner extends Vue {
    @Prop({ type: Object, default: {} }) parentMetadata?: any

    closeForm(): void {
      return undefined
    }

    setBusinessPartner(params: { id?: number, name?: string, uuid?: string }, isCloseForm = true): void {
      const { id, name, uuid } = params
      const { parentUuid, containerUuid } = this.parentMetadata
      // set ID value
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: 'C_BPartner_ID', // this.parentMetadata.columnName,
        value: id
      })

      // set display column (name) value
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        parentUuid,
        containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: 'DisplayColumn_C_BPartner_ID', // this.parentMetadata.displayColumnName,
        value: name
      })

      // set UUID value
      this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: 'C_BPartner_ID_UUID', // this.parentMetadata.columnName + '_UUID',
        value: uuid
      })

      if (isCloseForm) {
        this.closeForm()
      }
    }
}
