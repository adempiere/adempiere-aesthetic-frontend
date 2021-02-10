import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { AppModule, DeviceType } from '@/store/modules/app'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'FilterColumns',
  mixins: [Template]
})
export default class FilterColumns extends Vue {
    @Prop({ type: String, required: true }) containerUuid!: string

    // Computed properties
    get isMobile(): boolean {
      return AppModule.device === DeviceType.Mobile
    }

    get fieldsList(): IFieldDataExtendedUtils[] {
      return this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListFromPanel'](this.containerUuid)
    }

    // available fields
    get fieldsListAvailable(): IFieldDataExtendedUtils[] {
      return this.fieldsList.filter((fieldItem: IFieldDataExtendedUtils) => {
        const isDisplayed: boolean = fieldItem.isDisplayed || fieldItem.isDisplayedFromLogic
        return fieldItem.isActive && isDisplayed && !fieldItem.isKey
      })
    }

    get fieldsListShowed(): string[] {
      // columns showed
      return this.fieldsList.filter(itemField => {
        if (itemField.isShowedTableFromUser && (itemField.isDisplayed || itemField.isDisplayedFromLogic) && !itemField.isKey) {
          return true
        }
      }).map(itemField => {
        return itemField.columnName
      })
    }

    set fieldsListShowed(selecteds: string[]) {
      this.addField(selecteds)
    }

    // Methods
    /**
     * Set columns to hidden/showed in table
     * @param {array} selectedValues
     */
    addField(selectedValues: string[]) {
      this.$store.dispatch(Namespaces.Panel + '/' + 'changeFieldAttributesBoolean', {
        containerUuid: this.containerUuid,
        fieldsIncludes: selectedValues,
        attribute: 'isShowedTableFromUser',
        valueAttribute: true
      })
    }
}
