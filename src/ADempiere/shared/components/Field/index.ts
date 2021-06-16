import Template from './template.vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  evalutateTypeField,
  fieldIsDisplayed
} from '../../utils/DictionaryUtils'
import { PanelContextType } from '../../utils/DictionaryUtils/ContextMenuType'
import {
  DEFAULT_SIZE,
  IFieldReferencesType,
  ISizeData
} from '../../utils/references'
import { Namespaces } from '../../utils/types'
import { isEmptyValue, recursiveTreeSearch } from '@/ADempiere/shared/utils/valueUtils'
import { DeviceType, IAppState } from '@/ADempiere/modules/app/AppType'
import FieldOptions from './FieldOptions'

@Component({
  name: 'FieldDefinition',
  components: {
    FieldOptions
  },
  mixins: [Template]
})
export default class FieldDefinition extends Vue {
    @Prop({ type: Object, default: () => { return {} } }) metadataField?: any
    @Prop({
      type: [Number, String, Boolean, Array, Object, Date],
      default: undefined
    }) recordDataFields?: any

    @Prop({ type: Boolean, default: false }) inGroup?: boolean
    @Prop({ type: Boolean, default: false }) inTable?: boolean
    @Prop({ type: Boolean, default: false }) isAdvancedQuery?: boolean
    public field: any = {}
    // public visibleForDesktop = false
    // public value: any
    // public triggerMenu = 'click'
    // public showPopoverPath = false
    // public timeOut?: NodeJS.Timeout
    // public optionColumnName?: string
    // public visibleFields: boolean[] = []

    // Computed properties
    get isMobile(): boolean {
      return (this.$store.state.app as IAppState).device === DeviceType.Mobile
    }

    // load the component that is indicated in the attributes of received property
    get componentRender() {
      if (isEmptyValue(this.field.componentPath || !this.field.isSupported)) {
        return () => import('@/ADempiere/shared/components/Field/FieldText')
      }
      if (this.isSelectCreated) {
        return () => import('@/ADempiere/shared/components/Field/FieldSelectMultiple')
      }

      let field
      switch (this.field.componentPath) {
        case 'FieldAutocomplete':
          field = () => import('@/ADempiere/shared/components/Field/FieldAutocomplete')
          break
        case 'FieldBinary':
          field = () => import('@/ADempiere/shared/components/Field/FieldBinary')
          break
        case 'FieldButton':
          field = () => import('@/ADempiere/shared/components/Field/FieldButton')
          break
        case 'FieldColor':
          field = () => import('@/ADempiere/shared/components/Field/FieldColor')
          break
        case 'FieldDate':
          field = () => import('@/ADempiere/shared/components/Field/FieldDate')
          break
        case 'FieldImage':
          field = () => import('@/ADempiere/shared/components/Field/FieldImage')
          break
        case 'FieldLocation':
          field = () => import('@/ADempiere/shared/components/Field/FieldLocation')
          break
        case 'FieldLocator':
          field = () => import('@/ADempiere/shared/components/Field/FieldLocator')
          break
        case 'FieldNumber':
          field = () => import('@/ADempiere/shared/components/Field/FieldNumber')
          break
        case 'FieldSelect':
          field = () => import('@/ADempiere/shared/components/Field/FieldSelect')
          break
        case 'FieldText':
          field = () => import('@/ADempiere/shared/components/Field/FieldText')
          break
        case 'FieldTextLong':
          field = () => import('@/ADempiere/shared/components/Field/FieldTextLong')
          break
        case 'FieldTime':
          field = () => import('@/ADempiere/shared/components/Field/FieldTime')
          break
        case 'FieldYesNo':
          field = () => import('@/ADempiere/shared/components/Field/FieldYesNo')
          break
      }
      return field
    }

    get isPanelWindow() {
      return this.field.panelType === PanelContextType.Window
    }

    get preferenceClientId() {
      if (this.isPanelWindow) {
        return this.$store.getters[Namespaces.Preference + '/' + 'getPreferenceClientId']
      }
      return undefined
    }

    get fieldAttributes() {
      return {
        ...this.field,
        inTable: this.inTable,
        isPanelWindow: this.isPanelWindow,
        isAdvancedQuery: this.isAdvancedQuery,
        // DOM properties
        required: this.isMandatory,
        readonly: this.isReadOnly,
        displayed: this.isDisplayed,
        disabled: !this.field.isActive,
        isSelectCreated: this.isSelectCreated,
        placeholder: this.field.help ? this.field.help.slice(0, 40) + '...' : ''
      }
    }

    get isDisplayed(): boolean {
      if (this.isAdvancedQuery) {
        return this.field.isShowedFromUser
      }
      return (
        fieldIsDisplayed(this.field) &&
            (this.isMandatory || this.field.isShowedFromUser || this.inTable)
      )
    }

    get isMandatory(): boolean {
      if (this.isAdvancedQuery) {
        return false
      }
      return this.field.isMandatory || this.field.isMandatoryFromLogic
    }

    get isReadOnly(): boolean {
      if (this.isAdvancedQuery) {
        if (['NULL', 'NOT_NULL'].includes(this.field.operator)) {
          return true
        }
        return false
      }

      if (!this.field.isActive) {
        return true
      }

      const isUpdateableAllFields: boolean =
            this.field.isReadOnly || this.field.isReadOnlyFromLogic

      if (this.isPanelWindow) {
        let isWithRecord: boolean = this.field.recordUuid !== 'create-new'

        if ((this.preferenceClientId !== this.metadataField.clientId) && isWithRecord) {
          return true
        }

        if (this.field.isAlwaysUpdateable) {
          return false
        }
        if (
          this.field.isProcessingContext ||
                this.field.isProcessedContext
        ) {
          return true
        }

        // TODO: Evaluate record uuid without route.action
        // edit mode is diferent to create new
        if (this.inTable) {
          isWithRecord = !isEmptyValue(this.field.recordUuid)
        }

        return (
          (!this.field.isUpdateable && isWithRecord) ||
                isUpdateableAllFields || this.field.isReadOnlyFromForm
        )
      } else if (this.field.panelType === PanelContextType.Browser) {
        if (this.inTable) {
          // browser result
          return this.field.isReadOnly
        }
        // query criteria
        return this.field.isReadOnlyFromLogic
      }
      // other type of panels (process/report)
      return Boolean(isUpdateableAllFields)
    }

    get isFieldOnly(): any {
      if (this.inTable || this.field.isFieldOnly) {
        return undefined
      }
      return this.field.name
    }

    get isSelectCreated(): boolean {
      return (
            this.isAdvancedQuery! &&
            ['IN', 'NOT_IN'].includes(this.field.operator) &&
            !['FieldBinary', 'FieldDate', 'FieldSelect', 'FieldYesNo'].includes(
              this.field.componentPath
            )
      )
    }

    get getWidth(): number {
      return this.$store.getters[Namespaces.Utils + '/' + 'getWidthLayout']
    }

    get classField(): string {
      if (this.inTable) {
        return 'in-table'
      }
      return ''
    }

    @Watch('metadataField')
    handleMetaadataFieldChange(value: any) {
      this.field = value
    }

    // Methods
    recursiveTreeSearch = recursiveTreeSearch

    focusField() {
      if (
        this.field.handleRequestFocus ||
            (this.field.displayed && !this.field.readonly)
      ) {
        // eslint-disable-next-line
        // @ts-ignore
        this.$refs[this.field.columnName].requestFocus()
      }
    }

    // Hooks
    created() {
      // assined field with prop
      this.field = this.metadataField
      if (this.field.isCustomField && !this.field.componentPath) {
        let componentReference: Partial<IFieldReferencesType> = <
                IFieldReferencesType
            >evalutateTypeField(this.field.displayType)
        if (isEmptyValue(componentReference)) {
          componentReference = {
            componentPath: 'FieldText'
          }
        }
        this.field = {
          ...this.metadataField,
          isActive: true,
          isDisplayed: true,
          isDisplayedFromLogic: true,
          isShowedFromUser: true,
          //
          componentPath: componentReference.componentPath
        }
      }
    }
}
