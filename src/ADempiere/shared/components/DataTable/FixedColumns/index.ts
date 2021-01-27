import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'FixedColumns',
  mixins: [Template]
})
export default class FixedColumns extends Vue {
    @Prop({ type: String, required: true }) containerUuid!: string
    public columnsFixed: any[] = [] // columns showed
    public columnListAvailable: any[] = [] // available fields

    // Compouted properties
    get isMobile(): boolean {
      return this.$store.state.app.device === 'mobile'
    }

    get fieldsList(): IFieldDataExtendedUtils[] {
      return this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListFromPanel'](this.containerUuid)
    }

    // Methods
    isDisplayed(field: IFieldDataExtendedUtils): boolean {
      const isDisplayed: boolean = field.isActive && field.isDisplayed && field.isDisplayedFromLogic && !field.isKey
      if (field.isFixedTableColumn && field.isDisplayed) {
        this.columnsFixed.push(field.columnName)
      }
      return isDisplayed
    }

    generatePanel(fieldsList: IFieldDataExtendedUtils[]): void {
      this.columnListAvailable = fieldsList.filter((fieldItem: IFieldDataExtendedUtils) => {
        return this.isDisplayed(fieldItem)
      })
    }

    getPanel(): void {
      const fieldsList: IFieldDataExtendedUtils[] = this.fieldsList
      if (fieldsList) {
        this.generatePanel(fieldsList)
      }
    }

    /**
       * @param {array} selectedValues
       */
    addField(selectedValues: string[]): void {
      this.$store.dispatch(Namespaces.Panel + '/' + 'changeFieldAttributesBoolean', {
        containerUuid: this.containerUuid,
        fieldsIncludes: selectedValues,
        attribute: 'isFixedTableColumn',
        valueAttribute: true
      })
    }

    // Hooks
    created() {
      this.getPanel()
    }
}
