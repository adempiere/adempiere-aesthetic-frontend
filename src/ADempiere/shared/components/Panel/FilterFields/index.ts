import { DeviceType } from '@/ADempiere/modules/app/AppType'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'FilterFields',
  mixins: [Template]
})
export default class FilterFields extends Vue {
    @Prop({ type: String, required: true }) containerUuid!: string
    @Prop({ type: String, default: undefined }) groupField?: string
    @Prop({ type: String, default: 'window' }) panelType!: PanelContextType
    @Prop({ type: Boolean, default: false }) isAdvancedQuery!: boolean
    public selectedFields: any[] = []

    // Computed properties
    get isMobile(): boolean {
      return this.$store.state.app.device === DeviceType.Mobile
    }

    get fieldsListOptional(): any[] {
      if (this.panelType === PanelContextType.Table) {
        // fields to search without taking into account the mandatory
        return this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListFromPanel'](this.containerUuid, this.isAdvancedQuery)
          .filter((fieldItem: IFieldDataExtendedUtils) => {
            return fieldItem.componentPath !== 'FieldButton'
          })
      } else if (this.panelType === PanelContextType.Window) {
        // compare group fields to window
        const notMandatoryList = this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListNotMandatory']({ containerUuid: this.containerUuid })
          .filter((fieldItem: any) => {
            return fieldItem.groupAssigned === this.groupField
          })

        return notMandatoryList
      }
      // get fields not mandatory
      return this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListNotMandatory']({ containerUuid: this.containerUuid })
    }

    get getFieldSelected(): any[] {
      return this.fieldsListOptional
        .filter(fieldItem => {
          return fieldItem.isShowedFromUser
        })
        .map(itemField => itemField.columnName)
    }

    // Watchers
    @Watch('getFieldSelected')
    handleGetFieldSelectedChange(value: any) {
      this.selectedFields = value
    }

    // Methods
    /**
     * @param {array} selectedValues
     */
    addField(selectedValues: any[]): void {
      this.$store.dispatch(Namespaces.Panel + '/' + 'changeFieldShowedFromUser', {
        containerUuid: this.containerUuid,
        fieldsUser: selectedValues,
        show: true,
        groupField: this.groupField,
        isAdvancedQuery: this.isAdvancedQuery
      })
    }

    created() {
      this.selectedFields = this.getFieldSelected
    }
}
