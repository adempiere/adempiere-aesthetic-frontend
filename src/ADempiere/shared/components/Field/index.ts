import Template from './template.vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import DocumentStatus from './Popover/DocumentStatus'
import OperatorComparison from './Popover/OperatorComparison'
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
import { RouteConfig } from 'vue-router'
import { IOptionField } from './type'
import { DeviceType } from '@/ADempiere/modules/app/AppType'
import VueI18n, { TranslateResult } from 'vue-i18n'
import { ContextMenuState } from '@/ADempiere/modules/window'

@Component({
  name: 'FieldDefinition',
  components: {
    DocumentStatus,
    OperatorComparison
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
    public visibleForDesktop = false
    public value: any
    public triggerMenu = 'click'
    public showPopoverPath = false
    public timeOut?: NodeJS.Timeout
    public optionColumnName?: string
    public visibleFields: boolean[] = []

    // Computed properties
    get showPanelFieldOption(): boolean {
      return (this.$store.state[Namespaces.ContextMenu] as ContextMenuState).isShowOptionField
    }

    get labelStyle() {
      if (this.field.name.length >= 25) {
        return '35'
      } else if (this.field.name.length >= 20) {
        return '50'
      }
      return '110'
    }

    get isMobile(): boolean {
      return this.$store.state.app.device === DeviceType.Mobile
    }

    get contextMenuField() {
      return this.$store.getters[Namespaces.ContextMenu + '/' + 'getFieldContextMenu']
    }

    get panelContextMenu(): boolean {
      return this.$store.state.contextMenuModule.isShowRightPanel
    }

    get optionFieldFComponentRender() {
      let component
      const option: IOptionField | undefined = this.optionField.find((option: IOptionField) => (this.$route.query.typeAction as string) === option.name)
      const nameComponent: TranslateResult = isEmptyValue(option) ? (this.contextMenuField.name as TranslateResult) : (this.$route.query.typeAction as TranslateResult)
      switch (nameComponent) {
        case this.$t('field.info'):
          component = () => import('@/ADempiere/shared/components/Field/ContextMenuField/ContextInfo')
          break
        case this.$t('language'):
          component = () => import('@/ADempiere/shared/components/Field/ContextMenuField/Translated')
          break
        case this.$t('field.calculator'):
          component = () => import('@/ADempiere/shared/components/Field/ContextMenuField/Calculator')
          break
        case this.$t('field.preference'):
          component = () => import('@/ADempiere/shared/components/Field/ContextMenuField/Preference')
          break
        case this.$t('field.logsField'):
          component = () => import('@/ADempiere/shared/components/Field/ContextMenuField/ChangeLogs')
          break
      }
      return component
    }

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

    get optionField(): IOptionField[] {
      return [
        {
          name: this.$t('field.info'),
          enabled: true,
          fieldAttributes: this.fieldAttributes,
          svg: false,
          icon: 'el-icon-info'
        },
        {
          name: this.$t('table.ProcessActivity.zoomIn'),
          enabled: this.isContextInfo,
          fieldAttributes: this.fieldAttributes,
          svg: false,
          icon: 'el-icon-files'
        },
        {
          name: this.$t('language'),
          enabled: this.field.isTranslatedField,
          fieldAttributes: this.fieldAttributes,
          svg: true,
          icon: 'language'
        },
        {
          name: this.$t('field.calculator'),
          enabled: this.field.isNumericField,
          fieldAttributes: this.fieldAttributes,
          recordDataFields: this.recordDataFields,
          valueField: this.valueField,
          svg: false,
          icon: 'el-icon-s-operation'
        },
        {
          name: this.$t('field.preference'),
          enabled: true,
          fieldAttributes: this.fieldAttributes,
          valueField: this.valueField,
          svg: false,
          icon: 'el-icon-notebook-2'
        },
        {
          name: this.$t('field.logsField'),
          enabled: true,
          fieldAttributes: this.fieldAttributes,
          valueField: this.valueField,
          svg: true,
          icon: 'tree-table'
        }
      ]
    }

    get listOption(): IOptionField[] {
      return this.optionField.filter(option => option.enabled)
    }

    get permissionRoutes(): RouteConfig[] {
      return this.$store.getters.permission_routes
    }

    get valueField() {
      return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        parentUuid: this.fieldAttributes.parentUuid,
        containerUuid: this.fieldAttributes.containerUuid,
        columnName: this.fieldAttributes.columnName
      })
    }

    get openOptionField(): boolean {
      const option: IOptionField | undefined = this.optionField.find(option => this.$route.query.typeAction === option.name)
      if (!isEmptyValue(this.$route.query) && option) {
        return true
      }
      return false
    }

    set openOptionField(value: boolean) {
      if (!value) {
        this.showPopoverPath = false
        this.$router.push({
          name: this.$route.name!,
          query: {
            ...this.$route.query,
            typeAction: '',
            fieldColumnName: ''
          }
        }, () => {})
      }
    }

    @Watch('metadataField')
    handleMetaadataFieldChange(value: any) {
      this.field = value
    }

    @Watch('panelContextMenu')
    handlePanelContextMenu(value: boolean) {
      this.visibleForDesktop = false
    }

    @Watch('openOptionField')
    handleOpenOptionFieldChange(value: boolean) {
      if (!value) {
        this.showPopoverPath = false
      }
    }

    // Methods
    recursiveTreeSearch = recursiveTreeSearch

    handleOpen(key: any, keyPath: any) {
      this.triggerMenu = 'hover'
    }

    handleClose(key: any, keyPath: any) {
      this.triggerMenu = 'click'
    }

    handleSelect(key: VueI18n.TranslateResult, keyPath: any) {
      const option = this.listOption.find(option => option.name === key)
      if (option?.name.toString() === this.$t('table.ProcessActivity.zoomIn')) {
        this.redirect({ window: option.fieldAttributes.reference.zoomWindows[0] })
        return
      }
      if (this.isMobile) {
        this.$store.commit(Namespaces.ContextMenu + '/' + 'changeShowRigthPanel', true)
      } else {
        this.$store.commit(Namespaces.ContextMenu + '/' + 'schangeShowOptionField', true)
        this.visibleForDesktop = true
        this.$router.push({
          name: this.$route.name!,
          query: {
            ...this.$route.query,
            typeAction: key.toString(),
            fieldColumnName: this.field.columnName
          }
        }, () => {})
      }
      this.$store.commit(Namespaces.ContextMenu + '/' + 'changeShowPopoverField', true)
      this.$store.dispatch(Namespaces.ContextMenu + '/' + 'setOptionField', option)
      this.triggerMenu = 'hover'
    }

    closePopover() {
      this.$router.push({
        name: this.$route.name!,
        query: {
          ...this.$route.query,
          typeAction: '',
          fieldColumnName: ''
        }
      }, () => {})
    }

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

    handleCommand(command: any): void {
      this.$store.commit(Namespaces.ContextMenu + '/' + 'setRecordAccess', false)
      if (command.name === this.$t('table.ProcessActivity.zoomIn')) {
        this.redirect({ window: command.fieldAttributes.reference.zoomWindows[0] })
        return
      }
      if (this.isMobile) {
        this.$store.commit(Namespaces.ContextMenu + '/' + 'changeShowRigthPanel', true)
      } else {
        this.visibleForDesktop = true
      }
      this.$store.commit(Namespaces.ContextMenu + '/' + 'changeShowPopoverField', true)
      this.$store.dispatch(Namespaces.ContextMenu + '/' + 'setOptionField', command)
    }

    redirect(params: { window: any }) {
      const { window } = params
      const viewSearch = recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: window.uuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })
      if (viewSearch) {
        this.$router.push({
          name: viewSearch.name,
          query: {
            action: 'advancedQuery',
            tabParent: (0).toString(),
            [this.fieldAttributes.columnName]: this.value
          }
        }, () => {})
      } else {
        this.$message({
          type: 'error',
          showClose: true,
          message: this.$t('notifications.noRoleAccess').toString()
        })
      }
    }

    // Hooks
    created() {
      this.listOption.map(() => {
        this.visibleFields.push(false)
      })
      this.optionColumnName = this.$route.query.fieldColumnName as string
      this.timeOut = setTimeout(() => {
        if (this.isMobile && this.optionColumnName === this.field.columnName) {
          this.$store.commit(Namespaces.ContextMenu + '/' + 'changeShowRigthPanel', true)
          this.$store.dispatch(Namespaces.ContextMenu + '/' + 'setOptionField', {
            fieldAttributes: this.fieldAttributes,
            name: this.$route.query.typeAction,
            valueField: this.valueField
          })
        } else {
          this.showPopoverPath = true
        }
      }, 2000)
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
