import { fieldIsDisplayed } from '@/ADempiere/shared/utils/DictionaryUtils'
import { FIELDS_READ_ONLY_FORM, IFieldFormType } from '@/ADempiere/shared/utils/references'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { convertStringToBoolean } from '@/ADempiere/shared/utils/valueFormat'
import { Component, Mixins } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import Template from './template.vue'

@Component({
  name: 'FieldYesNo',
  mixins: [Template, MixinField]
})
export default class FieldYesNo extends Mixins(MixinField) {
    public valuesReadOnly: readonly {
        columnName: string
        isReadOnlyValue: boolean
    }[] = [
      {
        columnName: 'IsActive',
        isReadOnlyValue: false
      }
    ]

    // Computed properties
    get cssClassStyle(): string {
      let styleClass = ' custom-field-yes-no '
      if (this.metadata.cssClassName) {
        styleClass += this.metadata.cssClassName
      }
      return styleClass
    }

    // Methods
    parseValue(value: string): boolean {
      return convertStringToBoolean(value)
    }

    preHandleChange(value: any) {
      this.handleFieldChange({ value })
      if (!this.metadata.inTable && !this.metadata.isAdvancedQuery) {
        this.isReadOnlyForm(this.value)
      }
    }

    isReadOnlyForm(value: any): void {
      const fieldReadOnlyForm = FIELDS_READ_ONLY_FORM.find((item: IFieldFormType) => item.columnName === this.metadata.columnName)
      // columnName: IsActive, Processed, Processing
      if (fieldReadOnlyForm && fieldIsDisplayed(this.metadata)) {
        const fieldsExcludes = []
        // if isChangedAllForm it does not exclude anything, otherwise it excludes this columnName
        if (fieldReadOnlyForm.isChangedAllForm) {
          fieldsExcludes.push(this.metadata.columnName)
        }

        this.$store.dispatch(Namespaces.Panel + '/' + 'changeFieldAttributesBoolean', {
          containerUuid: this.metadata.containerUuid,
          fieldsIncludes: [],
          attribute: 'isReadOnlyFromForm',
          valueAttribute: Boolean(fieldReadOnlyForm.valueIsReadOnlyForm !== value),
          fieldsExcludes,
          currenValue: value
        })
      }
    }
}
