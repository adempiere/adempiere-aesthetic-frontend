import preferenceFields from './preferenceFields'
import { setPreference, deletePreference } from '@/ADempiere/modules/field/FieldService/preference'
import { createFieldFromDictionary, IFieldTemplateData } from '@/ADempiere/shared/utils/lookupFactory'
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import { IFieldLocation } from '../../FieldLocation/fieldList'
import language from '@/lang'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import Template from './template.vue'
import MixinForm from '../../../Form/MixinForm'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { Namespaces } from '@/ADempiere/shared/utils/types'

type IPreferenceMetadataItem = IFieldTemplateData & { containerUuid?: string }

@Component({
  name: 'Preference',
  mixins: [Template, MixinForm]
})
export default class Preference extends Mixins(MixinForm) {
    @Prop({
      type: [Object],
      required: true,
      default: null
    }) sourceField?: any

    @Prop({
      type: [String, Number, Boolean, Date, Array, Object],
      required: true,
      default: ''
    }) fieldValue: any

    // Data
    private preferenceFields!: IFieldLocation[]
    public metadataList!: IPreferenceMetadataItem[]
    private code = ''
    private description: string[] = []
    private isActive = false

    created() {
      this.metadataList = []
      this.preferenceFields = preferenceFields
    }

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

    get getDescriptionOfPreference(): string {
      if (isEmptyValue(this.metadataList)) {
        return ''
      }
      const forCurrentUser: IPreferenceMetadataItem | undefined = this.metadataList.find(field => field.columnName === 'AD_User_ID')
      const forCurrentClient: IPreferenceMetadataItem | undefined = this.metadataList.find(field => field.columnName === 'AD_Client_ID')
      const forCurrentOrganization: any = this.metadataList.find(field => field.columnName === 'AD_Org_ID')
      const forCurrentContainer: IPreferenceMetadataItem | undefined = this.metadataList.find(field => field.columnName === 'AD_Window_ID')
      if (!forCurrentClient) {
        return ''
      }
      //  Create Message
      let expl: string = language.t('components.preference.for').toString()//  components.preference.for
      if (forCurrentClient.value && forCurrentOrganization && forCurrentOrganization.value) {
        expl = expl.concat(language.t('components.preference.clientAndOrganization').toString())//  components.preference.clientAndOrganization
      } else if (forCurrentClient.value && forCurrentOrganization && !forCurrentOrganization.value) {
        expl = expl.concat(language.t('components.preference.allOrganizationOfClient').toString())//  components.preference.allOrganizationOfClient
      } else if (!forCurrentClient.value && forCurrentOrganization && forCurrentOrganization.value) {
        forCurrentOrganization.value = false
        expl = expl.concat(language.t('components.preference.entireSystem').toString())//  components.preference.entireSystem
      } else {
        expl = expl.concat(language.t('components.preference.entireSystem').toString())//  components.preference.entireSystem
      }
      if (forCurrentUser && forCurrentUser.value) {
        expl = expl.concat(language.t('components.preference.thisUser').toString())//  components.preference.thisUser
      } else {
        expl = expl.concat(language.t('components.preference.allUsers').toString())//  components.preference.allUsers
      }
      if (forCurrentContainer && forCurrentContainer.value) {
        expl = expl.concat(language.t('components.preference.thisWindow').toString())//  components.preference.thisWindow
      } else {
        expl = expl.concat(language.t('components.preference.allWindows').toString())//  components.preference.allWindows
      }
      return expl
    }

    // Hooks
    beforeMount() {
      if (isEmptyValue(this.metadataList)) {
        this.setFieldsList()
      }
    }

    // Watchers
    @Watch('isActive')
    handleIsActiveChange(value: boolean) {
      const preferenceValue = this.fieldValue
      if (value && isEmptyValue(this.metadataList)) {
        this.setFieldsList()
      }
      if (!isEmptyValue(preferenceValue)) {
        if ((typeof preferenceValue !== 'string') && (this.sourceField.componentPath !== 'FieldYesNo')) {
          this.code = preferenceValue
        } else {
          this.code = preferenceValue
        }
      }
    }

    // Methods

    close() {
      // this.$children[0].$props.visible = false
      (this.$children[0] as any).visible = false
      this.$store.commit(Namespaces.ContextMenu + '/' + 'changeShowRigthPanel', false)
    }

    remove(): void {
      const isForCurrentUser = this.metadataList.find(field => field.columnName === 'AD_User_ID')?.value
      const isForCurrentClient = this.metadataList.find(field => field.columnName === 'AD_Client_ID')?.value
      const isForCurrentOrganization = this.metadataList.find(field => field.columnName === 'AD_Org_ID')?.value
      const isForCurrentContainer = this.metadataList.find(field => field.columnName === 'AD_Window_ID')?.value
      deletePreference({
        parentUuid: this.sourceField.parentUuid,
        attribute: this.sourceField.columnName,
        isForCurrentUser,
        isForCurrentClient,
        isForCurrentOrganization,
        isForCurrentContainer
      })
        .then(() => {
          showMessage({
            message: language.t('components.preference.preferenceRemoved').toString()
          })
          this.close()
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn(`setPreference error: ${error.message}.`)
        })
    }

    notSubmitForm(event: any): boolean {
      event.preventDefault()
      return false
    }

    setFieldsList() {
      const fieldsList: (IFieldTemplateData & { containerUuid: string })[] = []
      // Product Code
      this.preferenceFields.forEach((element: any) => {
        this.createFieldFromDictionary(element).then((metadata: IFieldTemplateData) => {
          const data: IFieldTemplateData = metadata
          fieldsList.push({
            ...data,
            containerUuid: 'field-reference'
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

    sendValue(list: any[]): void {
      const isForCurrentUser = this.metadataList.find(field => field.columnName === 'AD_User_ID')?.value
      const isForCurrentClient = this.metadataList.find(field => field.columnName === 'AD_Client_ID')?.value
      const isForCurrentOrganization = this.metadataList.find(field => field.columnName === 'AD_Org_ID')?.value
      const isForCurrentContainer = this.metadataList.find(field => field.columnName === 'AD_Window_ID')?.value
      //
      setPreference({
        parentUuid: this.sourceField.parentUuid,
        attribute: this.sourceField.columnName,
        value: this.fieldValue,
        isForCurrentUser,
        isForCurrentClient,
        isForCurrentOrganization,
        isForCurrentContainer
      })
        .then(() => {
          showMessage({
            message: language.t('components.preference.preferenceIsOk').toString()
          })
          this.close()
        })
        .catch((error: any) => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn(`setPreference error: ${error.message}.`)
        })
    }
}
