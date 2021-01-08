import { Component, Mixins } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import MixinLocationField from './MixinLocation'
import LocationAddressForm from './LocationAddressForum'
import Template from './template.vue'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { IEntityData } from '@/ADempiere/modules/persistence'

@Component({
  name: 'FieldLocation',
  components: {
    LocationAddressForm
  },
  mixins: [MixinField, MixinLocationField, Template]
})
export default class FieldLocation extends Mixins(MixinField, MixinLocationField) {
    public localValues: any = {}

    // Computed properties
    get displayedValue(): any {
      /**
         * TODO: Add DisplayColumn (to locator's and location's fields) in entities
         * list response, to set value or empty value in fieldValue state when
         * change records with dataTable.
         */
      if (!this.value) {
        return undefined
      }

      return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: this.metadata.displayColumnName
      })
    }

    set displayedValue(value: any) {
      this.$store.commit('updateValueOfField', {
        parentUuid: this.metadata.parentUuid,
        containerUuid: this.metadata.containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: this.metadata.displayColumnName,
        value
      })
    }

    get popoverPlacement(): string {
      return this.metadata.popoverPlacement || 'top'
    }

    // Methods
    getLocation(): void {
      if (this.displayedValue) {
        return
      }

      const value = this.value
      if (!value) {
        return
      }

      this.requestGetLocationAddress({
        id: value
      })
        .then((responseLocation: IEntityData) => {
          const { attributes: values } = responseLocation

          this.localValues = values

          // TODO: Get Display_ColumnName from server request
          this.displayedValue = this.getDisplayedValue(values) || value
        })
        .catch(error => {
          console.warn(`Get Location Address, Field Location - Error ${error.code}: ${error.message}.`)
        })
    }
}
