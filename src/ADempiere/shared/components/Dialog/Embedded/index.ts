import Template from './template.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DeviceType, IAppState } from '@/ADempiere/modules/app/AppType'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { IContextActionData } from '@/ADempiere/modules/window'
import { ProcessState } from '@/ADempiere/modules/process'
import { IPanelDataExtended } from '@/ADempiere/modules/dictionary'
import { IRecordSelectionData, WindowState } from '@/ADempiere/modules/persistence'
import { showNotification } from '@/ADempiere/shared/utils/notifications'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { ISelectionProcessData } from '@/ADempiere/shared/store/modules/Utils/type'
import { IPOSAttributesData } from '@/ADempiere/modules/pos'

@Component({
  name: 'Embedded',
  mixins: [Template]
})
export default class Embedded extends Vue {
  @Prop({
    type: String,
    default: undefined
  }) parentUuid?: string

  @Prop({
    type: String,
    default: ''
  }) containerUuid!: string

  @Prop({
    type: String,
    default: 'window'
  }) panelType!: string

  @Prop({
    type: String,
    default: ''
  }) reportExportType!: string

  @Prop({
    type: String,
    default: undefined
  }) tableName?: string

  @Prop({
    type: Object,
    default: undefined
  }) recordId?: any

  @Prop({
    type: String,
    default: undefined
  }) visible?: string

  // Data
  public lock = false

  // Computed properties
  get isMobile(): boolean {
    return (this.$store.state.app as IAppState).device === DeviceType.Mobile
  }

  get width(): number {
    if (this.isMobile) {
      return 80
    }
    return 90
  }

  get attributeEmbedded(): Partial<IContextActionData> {
    return this.$store.getters[Namespaces.ContextMenu + '/' + 'getAttributeEmbedded'] as Partial<IContextActionData>
  }

  get isVisibleDialog(): boolean {
    if (this.isMobile) {
      return false
    }
    return (this.$store.state[Namespaces.Process] as ProcessState).isVisibleDialog
  }

  get modalMetadata(): Partial<IPanelDataExtended> {
    return (this.$store.state[Namespaces.Process] as ProcessState).metadata
  }

  get windowRecordSelected() {
    return (this.$store.state[Namespaces.Window] as WindowState).recordSelected
  }

  get getterDataRecordsAndSelection(): IRecordSelectionData {
    return this.$store.getters[Namespaces.BusinessData + '/' + 'getDataRecordAndSelection'](this.containerUuid)
  }

  get showRecordAccess(): boolean {
    if (this.isMobile) {
      return false
    }
    return this.$store.getters[Namespaces.ContextMenu + '/' + 'getShowRecordAccess']
  }

  // methods
  showNotification = showNotification

  closeDialog() {
    this.$store.dispatch(Namespaces.Process + '/' + 'setShowDialog', {
      type: this.modalMetadata.panelType,
      action: {
        name: ''
      }
    })
    this.$router.push({
      name: this.$route.name!,
      query: {
        ...this.$route.query,
        typeAction: ''
      }
    }, () => {})
    this.$store.commit(Namespaces.ContextMenu + '/' + 'setRecordAccess', false)
  }

  runAction(action: any) {
    this.$store.commit(Namespaces.ContextMenu + '/' + 'setRecordAccess', false)
    if (action.isSortTab) {
      this.$store.dispatch(Namespaces.Window + '/' + 'updateSequence', {
        parentUuid: this.modalMetadata.parentUuid,
        containerUuid: this.modalMetadata.containerUuid
      })
      return
    }
    if (action === undefined && this.windowRecordSelected !== undefined) {
      this.$router.push({
        name: this.$route.name!,
        query: {
          ...this.$route.query,
          action: this.windowRecordSelected.UUID
        }
      }, () => {})
      this.closeDialog()
    } else if (!isEmptyValue(action)) {
      const fieldNotReady = this.$store.getters[Namespaces.Panel + '/' + 'isNotReadyForSubmit'](action.uuid)
      if (this.panelType === 'From') {
        this.$store.dispatch(Namespaces.Process + '/' + 'processPos', {
          action: action, // process metadata
          parentUuid: this.parentUuid,
          idProcess: (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales.currentOrder.id,
          containerUuid: this.containerUuid,
          panelType: this.panelType, // determinate if get table name and record id (window) or selection (browser)
          parametersList: (this.$store.getters[Namespaces.Utils + '/' + 'getPosParameters'] as any[])
        })
          .catch(error => {
            console.warn(error)
          })
        this.closeDialog()
      } else {
        if (!fieldNotReady) {
          this.closeDialog()
          const porcesTabla = (this.$store.getters[Namespaces.Utils + '/' + 'getProcessSelect'] as Partial<ISelectionProcessData>).processTablaSelection
          const selection = (this.$store.getters[Namespaces.Utils + '/' + 'getProcessSelect'] as Partial<ISelectionProcessData>)
          if (porcesTabla) {
            // manage excecute process with records selection
            this.$store.dispatch(Namespaces.Process + '/' + 'selectionProcess', {
              action: action, // process metadata
              parentUuid: this.parentUuid,
              containerUuid: this.containerUuid,
              panelType: this.panelType, // determinate if get table name and record id (window) or selection (browser)
              reportFormat: this.reportExportType,
              recordUuidSelection: selection,
              isProcessTableSelection: true,
              routeToDelete: this.$route
            })
          } else {
            this.$store.dispatch(Namespaces.Process + '/' + 'startProcess', {
              action: action, // process metadata
              parentUuid: this.parentUuid,
              isProcessTableSelection: false,
              containerUuid: this.containerUuid,
              panelType: this.panelType, // determinate if get table name and record id (window) or selection (browser)
              reportFormat: this.reportExportType,
              routeToDelete: this.$route
            })
              .catch(error => {
                console.warn(error)
              })
          }
        } else {
          this.showNotification({
            type: 'warning',
            title: this.$t('notifications.emptyValues').toString(),
            name: '<b>' + fieldNotReady.name + '.</b> ',
            message: this.$t('notifications.fieldMandatory').toString()
          })
        }
      }
    }
  }
}
