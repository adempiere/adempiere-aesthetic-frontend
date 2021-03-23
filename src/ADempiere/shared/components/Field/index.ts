import Template from './template.vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import ContextInfo from './Popover/ContextInfo'
import DocumentStatus from './Popover/DocumentStatus'
import OperatorComparison from './Popover/OperatorComparison'
import Calculator from './Popover/Calculator'
import Translated from './Popover/Translated'
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
import Preference from '@/ADempiere/shared/components/Field/Popover/Preference/index'

@Component({
  name: 'FieldDefinition',
  components: {
    ContextInfo,
    DocumentStatus,
    OperatorComparison,
    Translated,
    Calculator,
    Preference
  },
  mixins: [Template]
})
export default class FieldDefinition extends Vue {
    @Prop({ type: Object, default: {} }) metadataField?: any
    @Prop({
      type: [Number, String, Boolean, Array, Object, Date],
      default: undefined
    })
    recordDataFields?: any

    @Prop({ type: Boolean, default: false }) inGroup?: boolean
    @Prop({ type: Boolean, default: false }) inTable?: boolean
    @Prop({ type: Boolean, default: false }) isAdvancedQuery?: boolean
    public field: any = {}

    // Computed properties
    // load the component that is indicated in the attributes of received property
    get componentRender() {
      if (!(this.field.componentPath || !this.field.isSupported)) {
        return () => import('@/ADempiere/shared/components/Field/FieldText')
      }
      if (this.isSelectCreated!) {
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
      // return () => import(`@/components/ADempiere/Field/${this.field.componentPath}`)
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
        isAdvancedQuery: this.isAdvancedQuery,
        // DOM properties
        required: this.isMandatory,
        readonly: this.isReadOnly,
        displayed: this.isDisplayed,
        disabled: !this.field.isActive,
        isSelectCreated: this.isSelectCreated
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
          isWithRecord = this.field.recordUuid
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

    get sizeFieldResponsive(): ISizeData {
      if (!this.isDisplayed) {
        return DEFAULT_SIZE
      }

      let sizeField: ISizeData | undefined
      if (this.field.size) {
        // set field size property
        sizeField = this.field.size
      }
      if (!sizeField) {
        // set default size
        sizeField = DEFAULT_SIZE
      }

      let newSizes: Partial<ISizeData> | undefined

      // in table set max width, used by browser result and tab children of window
      if (this.inTable) {
        newSizes = {
          xs: 24,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
        }
        return <ISizeData>newSizes
      }
      if (this.isAdvancedQuery) {
        newSizes = {
          xs: 24,
          sm: 24,
          md: 12,
          lg: 12,
          xl: 12
        }
        return <ISizeData>newSizes
      }

      if (this.isPanelWindow) {
        // TODO: Add FieldYesNo and name.length > 12 || 14
        if (this.field.componentPath === 'FieldTextLong') {
          return <ISizeData>sizeField
        }
        // two columns if is mobile or desktop and show record navigation
        if (
          this.getWidth <= 768 ||
                (this.getWidth >= 768 && this.field.isShowedRecordNavigation)
        ) {
          newSizes = {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12
          }
          return <ISizeData>newSizes
        } else if (this.inGroup && this.getWidth >= 992) {
          newSizes = {
            xs: sizeField.xs,
            sm: sizeField.sm * 2
          }
          if (this.getWidth <= 1199) {
            newSizes.md = sizeField.md
          } else {
            newSizes.md = sizeField.md! * 2
          }
          if (this.field.groupAssigned !== '') {
            newSizes.lg = sizeField.lg! * 2
            newSizes.xl = sizeField.xl! * 2
          } else {
            newSizes.lg = sizeField.lg
            newSizes.xl = sizeField.xl
          }
          return <ISizeData>newSizes
        }
        return <ISizeData>sizeField
      }
      return <ISizeData>sizeField
    }

    get processOrderUuid(): any[] {
      return this.$store.getters[Namespaces.Utils + '' + 'getOrders']
    }

    get isDocuemntStatus(): boolean {
      if (
        this.isPanelWindow &&
            !this.isAdvancedQuery
      ) {
        if (
          this.field.columnName === 'DocStatus' &&
                this.processOrderUuid
        ) {
          return true
        }
      }
      return false
    }

    get isContextInfo(): boolean {
      if (!this.isPanelWindow) {
        return false
      }
      return (
        Boolean(
          this.field.contextInfo && this.field.contextInfo.isActive
        ) ||
            Boolean(
              this.field.reference && this.field.reference.zoomWindows.length
            )
      )
    }

    @Watch('metadataField')
    handleMetaadataFieldChange(value: any) {
      this.field = value
    }

    // Methods
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
        if (!componentReference) {
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
