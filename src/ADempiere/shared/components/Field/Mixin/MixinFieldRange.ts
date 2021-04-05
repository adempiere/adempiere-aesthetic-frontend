import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'MixinFieldRange'
})
export default class extends Vue {
    @Prop({ type: Object, required: true }) metadata!: any

    get value(): any {
      const value = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName
      })
      const valueTo = this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName
      })

      return [
        value,
        valueTo
      ]
    }

    set value(value: any) {
      this.$store.commit('updateValueOfField', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        columnName: this.metadata.columnName,
        value
      })
    }
}
