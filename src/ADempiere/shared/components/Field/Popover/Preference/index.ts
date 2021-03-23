import filelistPreference from './FileListPreference'
import { getPreference } from '@/ADempiere/modules/field/FieldService/preference'
import { createFieldFromDictionary, IFieldTemplateData } from '@/ADempiere/shared/utils/lookupFactory'
import { attributePreference } from '@/ADempiere/shared/utils/valueUtils'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { IFieldLocation } from '../../FieldLocation/fieldList'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import Template from './template.vue'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { ElDropdown } from 'element-ui/types/dropdown'
import { ElDropdownItem } from 'element-ui/types/dropdown-item'
import { ElDropdownMenu } from 'element-ui/types/dropdown-menu'

@Component({
  name: 'Preference',
  mixins: [Template]
})
export default class Preference extends Vue {
    @Prop({
      type: [Object],
      required: true,
      default: null
    }) fieldAttributes?: any

    @Prop({
      type: [String, Number, Boolean, Date, Array, Object],
      required: true,
      default: ''
    }) fieldValue: any

    @Prop({
      type: String,
      default: 'fiel-reference'
    }) containerUuid!: string

    @Prop({
      type: String,
      default: undefined
    }) panelType?: PanelContextType

    // Data
    private filelistPreference: IFieldLocation[] = filelistPreference
    private metadataList: (IFieldTemplateData & { containerUuid: string })[] = []
    private code = ''
    private description: string[] = []
    private isActive = false
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private unsubscribe: Function = () => {}

    // Computed properties
    get fieldsListPreference() {
      if (this.metadataList) {
        return this.metadataList.map(item => {
          return {
            label: item.name!,
            value: item.value!,
            columnName: item.columnName!,
            sequence: item.sequence
          }
        })
      }
    }

    get descriptionOfPreference() {
      const label = this.fieldsListPreference?.filter(element => {
        return element.value
      })
      if (label) {
        if (label[0] && label[0].columnName && label[0].columnName === 'AD_User_ID') {
          return this.$t('components.preference.defaulMessageUser')
        }
        return this.$t('components.preference.defaulMessage')
      }
      return []
    }

      // Watchers
      @Watch('isActive')
    handleIsActiveChange(value: boolean) {
      const preferenceValue = this.fieldValue
      if (value && !this.metadataList.length) {
        this.setFieldsList()
      }
      if (preferenceValue) {
        if ((typeof preferenceValue !== 'string') && (this.fieldAttributes.componentPath !== 'FieldYesNo')) {
          this.code = preferenceValue
        } else {
          this.code = preferenceValue
        }
      }
    }

      // hooks
      created() {
        this.unsubscribe = this.subscribeChanges()
      }

      beforeDestroy() {
        this.unsubscribe()
      }

      // Methods
    createFieldFromDictionary = createFieldFromDictionary
    attributePreference = attributePreference

    close() {
      // this.$children[0].$props.visible = false
      (this.$children[0] as any).visible = false
    }

    notSubmitForm(event: any): boolean {
      event.preventDefault()
      return false
    }

    setFieldsList() {
      const fieldsList: (IFieldTemplateData & { containerUuid: string })[] = []
      // Product Code
      this.filelistPreference.forEach((element: any) => {
        this.createFieldFromDictionary(element)
          .then((metadata: IFieldTemplateData) => {
            const data: IFieldTemplateData = metadata
            fieldsList.push({
              ...data,
              containerUuid: 'fiel-reference'
            })
            if (data.value) {
              this.description.push(data.name!)
            }
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
      })
      this.metadataList = fieldsList
    }

    sendValue(list: any[]) {
      const preference = this.attributePreference({
        parentUuid: '',
        containerUuid: this.containerUuid,
        panelType: this.panelType!,
        attribute: this.fieldAttributes.columnName,
        value: this.code,
        level: list
      })
      getPreference(preference)
    }

    changeValue(value: any) {
      switch (value.columName) {
        // case 'options':
        case 'AD_Client_ID':
          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            containerUuid: 'fiel-reference',
            columnName: value.columName,
            value: value.value
          })
          break
        case 'AD_Org_ID':
          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            containerUuid: 'fiel-reference',
            columnName: value.columName,
            value: value.value
          })
          break
        case 'AD_User_ID':
          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            containerUuid: 'fiel-reference',
            columnName: value.columName,
            value: value.value
          })
          break
        case 'AD_Window_ID':
          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            containerUuid: 'fiel-reference',
            columnName: value.columName,
            value: value.value
          })
          break
      }
    }

    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField') {
          // const values = this.$store.getters.getValuesView({
          //   containerUuid: mutation.payload.containerUuid,
          //   format: 'object'
          // })
          // this.changeValue(values)
        }
      })
    }
}
