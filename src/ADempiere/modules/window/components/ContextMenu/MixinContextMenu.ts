import {
  Actionable,
  ActionContextName,
  ActionContextType,
  PanelContextType,
  ReportExportContextType
} from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import {
  exportFileFromJson,
  supportedTypes
} from '@/ADempiere/shared/utils/exportUtil'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Prop, Watch, Ref, Mixins } from 'vue-property-decorator'
import {
  IContextActionData,
  IContextMenuData,
  IDocumentActionData,
  IListDocumentAction,
  RecordAccessAction,
  ReportableActions,
  WindowDefinitionAction,
  WindowProcessAsociatedAction
} from '../../WindowType'
import {
  IDataLog,
  IPrivateAccessDataExtended,
  IRecordSelectionData,
  IReferenceListDataExtended,
  IWindowOldRoute,
  KeyValueData
} from '@/ADempiere/modules/persistence/PersistenceType'
import ItemRelations from './ItemsRelations'
import { RouteConfig } from 'vue-router'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { INotificationProcessData } from '@/ADempiere/modules/process/ProcessType'
import { showNotification } from '@/ADempiere/shared/utils/notifications'
import { IReportOutputDataExtended } from '@/ADempiere/modules/report'
import { convertFieldsListToShareLink, recursiveTreeSearch, clientDateTime, isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import ROUTES from '@/ADempiere/shared/utils/Constants/zoomWindow'
import MixinRelations from './MixinRelations'
import { IPanelParameters } from '@/ADempiere/shared/store/modules/panel/type'

@Component({
  name: 'MixinContextMenu',
  mixins: [MixinRelations],
  components: {
    ItemRelations
  }
})
export default class MixinContextMenu extends Mixins(MixinRelations) {
    @Ref() readonly contextMenu!: any
    // @Prop({ default: undefined, type: String }) private menuParentUuid?: string
    @Prop({ default: undefined, type: String }) private parentUuid?: string
    @Prop({ type: String, required: true }) private containerUuid?: string
    @Prop({ default: undefined, type: String }) private panelType?: PanelContextType
    @Prop({ default: undefined, type: String }) private tableName?: string
    @Prop({ default: false, type: Boolean }) private isReport?: boolean
    @Prop({ default: undefined, type: String }) private lastParameter?: string
    @Prop({ default: undefined, type: String }) private reportFormat?: String
    @Prop({ default: undefined, type: Boolean }) private isInsertRecord?: boolean
    @Prop({ default: false, type: Boolean }) isListRecord?: boolean
    @Prop({ default: 'xlsx', type: String }) private defaultFormatExport?: string
    @Prop({ default: false, type: Boolean }) isDisplayed?: boolean

    protected actions: IContextActionData[] = []
    private supportedTypes = supportedTypes
    public references: Partial<IReferenceListDataExtended> | IReferenceListDataExtended[] = []
    public file: any = ''
    public downloads: any = ''
    private metadataMenu?: Partial<IContextMenuData> = {}
    private recordUuid = ''
    public isLoadedReferences = false

    get getProcessResult() {
      const result = this.$store.getters[Namespaces.Process + '/' + 'getProcessResult']
      return result
    }

    // computed properties
    get isWindow(): boolean {
      return this.panelType === PanelContextType.Window
    }

    get isWithRecord() {
      return !isEmptyValue(this.recordUuid) && this.recordUuid !== 'create-new'
    }

    get getterContextMenu(): IContextMenuData | undefined {
      return this.$store.getters[
        Namespaces.ContextMenu + '/' + 'getContextMenu'
      ](this.containerUuid)
    }

    get isReferencesContent(): boolean {
      if (
        this.isWindow && this.isWithRecord
      ) {
        return true
      }
      return false
    }

    get getterReferences(): IReferenceListDataExtended[] {
      if (this.isReferencesContent) {
        const result: IReferenceListDataExtended[] = this.$store.getters[
          Namespaces.Window + '/' + 'getReferencesList'
        ](this.parentUuid, this.recordUuid)
        return result
      }
      return []
    }

    // get relationsList(): any[] {
    //   let menuUuid: string = this.$route.params.menuParentUuid
    //   if (!menuUuid) {
    //     menuUuid = this.menuParentUuid!
    //   }
    //   const relations: any = this.$store.getters[
    //     Namespaces.ContextMenu + '/' + 'getRelations'
    //   ](menuUuid)
    //   if (relations && relations.children) {
    //     return relations.children
    //   }
    //   return []
    // }

    get permissionRoutes(): RouteConfig[] {
      return this.$store.state.permission.routes
    }

    get valuesPanelToShare(): string {
      let containerUuid: string = this.containerUuid!
      if (this.$route.query.action === 'advancedQuery') {
        containerUuid = 'table_' + containerUuid
      }

      return this.$store.getters[
        Namespaces.Panel + '/' + 'getParametersToShare'
      ]({
        containerUuid,
        isOnlyDisplayed: true
      })
    }

    get getterFieldsList(): IFieldDataExtendedUtils[] {
      return this.$store.getters[
        Namespaces.Panel + '/' + 'getFieldsListFromPanel'
      ](this.containerUuid)
    }

    get getterFieldsListHeader(): string[] {
      const header: IFieldDataExtendedUtils[] = this.getterFieldsList.filter(
        (fieldItem: IFieldDataExtendedUtils) => {
          const isDisplayed: boolean =
                    fieldItem.isDisplayed || fieldItem.isDisplayedFromLogic
          if (fieldItem.isActive && isDisplayed && !fieldItem.isKey) {
            return fieldItem.name
          }
        }
      )
      return header.map((fieldItem: IFieldDataExtendedUtils) => {
        return fieldItem.name
      })
    }

    get getterFieldsListValue(): string[] {
      const value = this.getterFieldsList.filter(
        (fieldItem: IFieldDataExtendedUtils) => {
          const isDisplayed: boolean =
                    fieldItem.isDisplayed || fieldItem.isDisplayedFromLogic
          if (fieldItem.isActive && isDisplayed && !fieldItem.isKey) {
            return fieldItem
          }
        }
      )
      return value.map((fieldItem: IFieldDataExtendedUtils) => {
        if (fieldItem.componentPath === 'FieldSelect') {
          return fieldItem.displayColumnName!
        }
        return fieldItem.columnName
      })
    }

    get getAllDataRecords(): IRecordSelectionData {
      return this.$store.getters[Namespaces.BusinessData + '/' + 'getDataRecordAndSelection'](this.containerUuid)
    }

    get getDataSelection(): any[] {
      return this.getAllDataRecords.selection
    }

    get isDisabledExportRecord(): boolean {
      if (this.panelType === PanelContextType.Browser) {
        return this.getDataSelection.length < 1
      }
      return false
    }

    get getDataRecord(): any[] {
      return this.getAllDataRecords.record.filter((fieldItem: any) => {
        if (this.recordUuid === fieldItem.UUID) {
          return fieldItem
        }
      })
    }

    get getDataLog(): IDataLog | undefined {
      if (this.isWindow) {
        return this.$store.getters[Namespaces.Window + '/' + 'getDataLog'](
          this.containerUuid,
          this.recordUuid
        )
      }
    }

    get processParametersExecuted(): KeyValueData[] | undefined | IPanelParameters[] {
      const result: INotificationProcessData = this.$store.getters[
        Namespaces.Process + '/' + 'getCachedReport'
      ](this.$route.params.instanceUuid)
      return result.parameters
    }

    get getOldRouteOfWindow(): IWindowOldRoute | false {
      if (this.isWindow) {
        const oldRoute: IWindowOldRoute = this.$store.state.windowModule.windowOldRoute
        if (
          !isEmptyValue(oldRoute.query.action) &&
                oldRoute.query.action !== 'create-new' &&
                this.$route.query.action === 'create-new'
        ) {
          return oldRoute
        }
      }
      return false
    }

    get getReportDefinition(): INotificationProcessData | undefined {
      return this.$store.getters[Namespaces.Process + '/' + 'getCachedReport'](
        this.$route.params.instanceUuid
      )
    }

    get isPersonalLock(): boolean {
      return this.$store.state.user.role.isPersonalLock!
    }

    get listDocumentActions(): IDocumentActionData[] {
      const result: IListDocumentAction = this.$store.getters[
        Namespaces.ContextMenu + '/' + 'getListDocumentActions'
      ]
      return result.documentActionsList
    }

    get isManageDataRecords(): boolean {
      return ['browser', 'window'].includes(this.panelType!)
    }

    get shorcutKey(): {
        defaultValues: string[]
        deleteRecord: string[]
        deleteRecord2: string[]
        refreshData: string[]
        } {
      return {
        defaultValues: ['f2'],
        deleteRecord: ['f3'],
        deleteRecord2: ['ctrl', 'd'],
        refreshData: ['f5']
      }
    }

    get getCurrentRecord(): any {
      const record: any = this.getAllDataRecords.record.find(fieldItem => {
        if (this.recordUuid === fieldItem.UUID) {
          return fieldItem
        }
      })
      if (!isEmptyValue(record)) {
        return record
      }
      return {} as IKeyValueObject
    }

    get tableNameCurrentTab(): string {
      const windowUuid: string = (this.getterContextMenu?.actions[0] as any).parentUuid
      const getWindow = this.$store.getters[Namespaces.WindowDefinition + '/' + 'getWindow'](windowUuid)
      const current = getWindow.tabs[0]
      if (!isEmptyValue(current)) {
        return current.tableName
      }
      return ''
    }

    get isLockRecord(): boolean {
      return this.$store.getters[Namespaces.User + '/' + 'getRole'].isPersonalLock
    }

    get recordAccess(): RecordAccessAction {
      const recordAccessAction: RecordAccessAction = {
        action: ActionContextName.RecordAccess,
        disabled: false,
        hidden: false,
        isSortTab: true,
        name: this.$t('data.recordAccess.actions').toString(),
        type: ActionContextType.DataAction,
        tableName: this.tableNameCurrentTab
      }
      return recordAccessAction
    }

    // Watchers
    @Watch('$route.query.action')
    handleRouteQueryAction(actionValue: string) {
      this.recordUuid = actionValue
      // only requires updating the context menu if it is Window
      if (this.isWindow) {
        this.generateContextMenu()
        this.getReferences()
      }
    }

    @Watch('isInsertRecord')
    async handleIsInsertRecord(newValue: any, oldValue: any) {
      if (
        this.isWindow &&
            newValue !== oldValue
      ) {
        this.generateContextMenu()
      }
    }

    @Watch('getDataLog')
    async handleGetDataLog(newValue: any, oldValue: any) {
      if (
        this.isWindow &&
            newValue !== oldValue
      ) {
        this.generateContextMenu()
      }
    }

    @Watch('isDisabledExportRecord')
    async handleIsDisabledExportRecord(isDisabled: boolean) {
      if (isDisabled) {
        this.$nextTick(() => {
          this.contextMenu.close('exportRecord')
        })
      }
    }

    // Note: Check if those watchers are hooks

    created() {
      this.recordUuid = this.$route.query.action as string
      this.file = this.$store.getters[Namespaces.Process + '/' + 'getProcessResult'].download
      this.downloads = this.$store.getters[Namespaces.Process + '/' + 'getProcessResult'].url
    }

    // Methods
    showNotification = showNotification

    refreshData(): void {
      if (this.isWindow) {
        this.$store
          .dispatch(Namespaces.Window + '/' + 'getDataListTab', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            isRefreshPanel: true,
            recordUuid: this.recordUuid
          })
          .catch(error => {
            console.warn(
                        `Error getting data list tab. Message: ${error.message}, code ${error.code}.`
            )
          })
      } else if (this.panelType === PanelContextType.Browser) {
        const fieldsEmpty: string[] = this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListEmptyMandatory'](
          {
            containerUuid: this.containerUuid,
            fieldsList: this.getterFieldsList
          }
        )
        if (fieldsEmpty.length) {
          this.$message({
            message:
                        this.$t(
                          'notifications.mandatoryFieldMissing'
                        ).toString() + fieldsEmpty,
            type: 'info',
            showClose: true
          })
        } else {
          this.$store.dispatch(Namespaces.Browser + '/' + 'getBrowserSearch', {
            containerUuid: this.containerUuid,
            isClearSelection: true
          })
        }
      }
    }

    actionContextMenu(event: any): void {
      switch (event.srcKey) {
        case 'defaultValues':
          this.$store.dispatch(Namespaces.Panel + '/' + 'setDefaultValues', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            recordUuid: this.recordUuid,
            panelType: 'window',
            isNewRecord: true
          })
          break
        case 'deleteRecord':
        case 'deleteRecord2':
          this.$store.dispatch(Namespaces.Window + '/' + 'deleteEntity', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            recordUuid: this.recordUuid
          })
          break
        case 'refreshData':
          this.refreshData()
          break
      }
    }

    getReferences(): void {
      console.warn('getReferences x')
      if (this.isReferencesContent) {
        console.log('x1')
        this.references = this.getterReferences
        // const references = this.getterReferences
        console.log('references')
        // console.log(references)
        if (this.references && this.references.length) {
          // this.references = references
          console.log('x2')
          this.isLoadedReferences = true
        } else {
          console.log('x3')
          this.isLoadedReferences = false
          this.$store
            .dispatch(Namespaces.Window + '/' + 'getReferencesListFromServer', {
              parentUuid: this.parentUuid,
              containerUuid: this.containerUuid,
              tableName: this.tableName,
              recordUuid: this.recordUuid
            })
            .then(() => {
              this.references = this.getterReferences
            })
            .finally(() => {
              this.isLoadedReferences = true
            })
        }
      } else {
        this.references = []
        this.isLoadedReferences = false
      }
    }

    formatJson(filterVal: string[], jsonData: string[]): any[][] {
      return jsonData.map((row: any) => {
        return filterVal.map((column: any) => {
          return row[column]
        })
      })
    }

    exportRecord(fotmatToExport: any): void {
      const tHeader: string[] = this.getterFieldsListHeader
      const filterVal: string[] = this.getterFieldsListValue
      let list: any[] = []
      if (this.isWindow) {
        list = this.getDataRecord
      } else if (this.panelType === PanelContextType.Browser) {
        // TODO: Check usage as the selection is exported with the table menu
        list = this.getDataSelection
      }
      let title: string | undefined = (this.metadataMenu as any).name
      if (isEmptyValue(title)) {
        title = this.$route.meta.title
      }
      const data = this.formatJson(filterVal, list)
      exportFileFromJson({
        header: tHeader,
        data,
        fileName: `${title} ${clientDateTime()}`,
        exportType: fotmatToExport
      })
    }

    validatePrivateAccess(params: { isLocked: boolean, tableName: string, recordId: number }): void {
      const { isLocked, tableName, recordId } = params
      if (!this.isPersonalLock) {
        let isHiddenLock = false
        if (isLocked) {
          isHiddenLock = true
        }

        this.actions = this.actions.map((actionItem: IContextActionData) => {
          if (actionItem.action === 'lockRecord') {
            return {
              ...actionItem,
              hidden: isHiddenLock,
              tableName,
              recordId
            }
          } else if (actionItem.action === ActionContextName.UnlockRecord) {
            return {
              ...actionItem,
              hidden: !isHiddenLock
            }
          }
          return actionItem
        })
      }
    }

    generateContextMenu(): void {
      this.metadataMenu = this.getterContextMenu

      // the function is broken avoiding that an error is generated when closing
      // session being in a window, since the store of vuex is cleaned, being
      // this.metadataMenu with value undefined
      if (isEmptyValue(this.metadataMenu)) {
        return
      }
      this.actions = this.metadataMenu!.actions!

      // TODO: Add store attribute to avoid making repeated requests
      let isChangePrivateAccess = true
      if (this.isReferencesContent) {
        if (!isEmptyValue(this.getCurrentRecord) && !isEmptyValue(this.tableNameCurrentTab)) {
          this.$store
            .dispatch(Namespaces.BusinessData + '/' + 'getPrivateAccessFromServer', {
              tableName: this.tableNameCurrentTab,
              recordId: this.getCurrentRecord[this.tableNameCurrentTab + '_ID'],
              recordUuid: this.$route.query.action
            })
            .then(
              (privateAccessResponse: IPrivateAccessDataExtended) => {
                isChangePrivateAccess = false
                this.validatePrivateAccess(privateAccessResponse)
              }
            )
        }

        const processAction:
                | IContextActionData
                | undefined = this.actions.find((item: IContextActionData) => {
                // TODO: Compare with 'action' attribute and not with 'name' (this change with language)
                  if (
                    item.name === 'Procesar Orden' ||
                    item.name === 'Process Order'
                  ) {
                    const reportableAction = item as ReportableActions
                    return reportableAction
                  }
                })
        if (processAction) {
          this.$store.dispatch(Namespaces.Order + '/' + 'setOrder', processAction)
        }
      }

      if (this.isWindow && isEmptyValue(this.actions.find((element: Actionable) => element.action === ActionContextName.RecordAccess))) {
        this.actions.push(this.recordAccess)
      }

      if (this.actions && this.actions.length) {
        this.actions.forEach((item: IContextActionData) => {
          const itemAction = item as ReportableActions
          const { action } = itemAction
          if (this.$route.meta &&
            this.$route.meta.type === 'report' &&
                    action === ActionContextName.StartProcess
          ) {
            itemAction.reportExportType = ReportExportContextType.Html
          }

          // if no exists set prop with value
          itemAction.disabled = false
          if (
            (this.$route.name !== 'Report Viewer' &&
                        action === 'changeParameters') ||
                    (this.$route.meta.type === 'process' &&
                        itemAction.type === 'summary')
          ) {
            itemAction.disabled = true
          }

          if (this.$route.meta.type === 'window') {
            if (this.isLockRecord) {
              if (action === 'lockRecord') {
                itemAction.hidden = isChangePrivateAccess
              } else if (action === 'unlockRecord') {
                itemAction.hidden = !isChangePrivateAccess
              }
            }

            // rollback
            if (itemAction.action === 'undoModifyData') {
              itemAction.disabled = Boolean(
                !this.getDataLog && !this.getOldRouteOfWindow
              )
            } else if (
              !this.isWithRecord ||
                        !this.isInsertRecord
            ) {
              itemAction.disabled = true
            }
          }
        })
      }
    }

    showModal(action: WindowProcessAsociatedAction) {
      // TODO: Refactor and remove redundant dispatchs
      if (['process'].includes(action.type)) {
        // Add context from view open in process to opening
        if (
          action.associated.parentUuid ||
                action.associated.containerUuid
        ) {
          const attributes = this.$store.getters[Namespaces.FieldValue + '/' + 'getValuesView']({
            parentUuid: action.associated.parentUuid,
            containerUuid: action.associated.containerUuid
          })

          if (!isEmptyValue(attributes)) {
            this.$store.dispatch(Namespaces.FieldValue + '/' + 'updateValuesOfContainer', {
              containerUuid: action.uuid,
              attributes: <KeyValueData[]>attributes
            })
          }
        }

        // open modal dialog with metadata
        this.$store.dispatch(Namespaces.Process + '/' + 'setShowDialog', {
          type: action.type,
          action: {
            ...action,
            containerUuid: action.uuid
          }
        })
      }
    }

    executeAction(action: IContextActionData) {
      let containerParams: string = this.$route.meta.uuid
      if (this.lastParameter !== undefined) {
        containerParams = this.lastParameter
      }
      const fieldsNotReady = this.$store.getters[Namespaces.Panel + '/' + 'getFieldsListEmptyMandatory']({
        containerUuid: containerParams
      })

      // run process or report
      if (isEmptyValue(fieldsNotReady)) {
        let menuParentUuid = this.menuParentUuid
        if (isEmptyValue(menuParentUuid) && this.$route.params) {
          if (!isEmptyValue(this.$route.params.menuParentUuid)) {
            menuParentUuid = this.$route.params.menuParentUuid
          }
        }

        if (this.panelType === 'process') {
          this.$store.dispatch(Namespaces.Utils + '/' + 'setTempShareLink', {
            processId: this.$route.params.processId,
            href: window.location.href
          })
        }

        const reportableAction = <ReportableActions>action
        let reportFormat = reportableAction.reportExportType
        if (isEmptyValue(reportFormat)) {
          reportFormat = <ReportExportContextType> this.$route.query.reportType
          if (isEmptyValue(reportFormat)) {
            reportFormat = this.$route.meta.reportFormat
            if (isEmptyValue(reportFormat)) {
              reportFormat = ReportExportContextType.Html // 'html'
            }
          }
        }
        this.$store.dispatch(Namespaces.Process + '/' + action.action, {
          action,
          parentUuid: this.containerUuid,
          containerUuid: containerParams, // EVALUATE IF IS action.uuid
          panelType: this.panelType, // determinate if get table name and record id (window) or selection (browser)
          reportFormat, // this.$route.query.reportType ? this.$route.query.reportType : action.reportExportType,
          menuParentUuid, // to load relationsList in context menu (report view)
          routeToDelete: this.$route
        }, { root: true })
          .catch(error => {
            console.warn(error)
          })
      } else {
        this.showNotification({
          type: 'warning',
          title: this.$t('notifications.emptyValues').toString(),
          name: '<b>' + fieldsNotReady + '.</b> ',
          message: this.$t('notifications.fieldMandatory').toString(),
          isRedirect: false
        })
      }
    }

    updateReport(action: any) {
      let instanceUuid: string = action.instanceUuid
      if (isEmptyValue(instanceUuid)) {
        instanceUuid = this.$route.params.instanceUuid
      }
      let processId: string = action.processId
      if (isEmptyValue(processId)) {
        processId = this.$route.params.processId
      }
      this.$store.dispatch(Namespaces.Report + '/' + 'getReportOutputFromServer', {
        instanceUuid,
        processUuid: action.processUuid,
        tableName: action.tableName,
        processId,
        printFormatUuid: action.printFormatUuid,
        reportViewUuid: action.reportViewUuid,
        isSummary: false,
        reportName: this.$store.getters[Namespaces.Process + '/' + 'getProcessResult'].name,
        reportType: this.$store.getters[Namespaces.Utils + '/' + 'getReportType'],
        option: action.option
      })
        .then((reportOutputResponse: IReportOutputDataExtended) => {
          if (!reportOutputResponse.isError) {
            let link: Partial<HTMLAnchorElement> = {
              href: undefined,
              download: undefined
            }

            const blob = new Blob(
              [reportOutputResponse.outputStream],
              { type: reportOutputResponse.mimeType }
            )
            link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = reportOutputResponse.fileName
            const finalLink = <HTMLAnchorElement>link

            if (reportOutputResponse.reportType !== ReportExportContextType.Pdf && reportOutputResponse.reportType !== ReportExportContextType.Html) {
              finalLink.click()
            }
            reportOutputResponse.url = link.href
          }
          this.$store.dispatch(Namespaces.Process + '/' + 'finishProcess', {
            processOutput: reportOutputResponse,
            routeToDelete: this.$route
          })
        })
    }

    runAction(action: IContextActionData): void {
      if (action && action.type && action.type === ActionContextType.Action) {
        this.executeAction(action)
      } else if (action && action.type && action.type === ActionContextType.Process) {
        // run process associate with view (window or browser)
        const processAction = action as WindowProcessAsociatedAction
        this.showModal(processAction)
      } else if (action && action.type && action.type === ActionContextType.DataAction) {
        if (action.action === ActionContextName.UndoModifyData && Boolean(!this.getDataLog) && this.getOldRouteOfWindow) {
          this.$router.push({
            path: this.getOldRouteOfWindow.path,
            query: {
              ...this.getOldRouteOfWindow.query
            }
          }, () => {})
        } else if (action.action === ActionContextName.RecordAccess) {
          this.$store.dispatch(Namespaces.Process + '/' + 'setShowDialog', {
            type: this.panelType,
            action: action
          })
        } else if (action.action !== ActionContextName.UndoModifyData) {
          if (action.action === ActionContextName.SetDefaultValues && this.$route.query.action === 'create-new') {
            return
          }

          const defaultAction = action as WindowDefinitionAction

          this.$store.dispatch(Namespaces.Panel + '/' + defaultAction.action, {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            recordUuid: this.recordUuid,
            panelType: this.panelType,
            isNewRecord: defaultAction.action === ActionContextName.SetDefaultValues,
            tableName: this.tableName,
            recordId: this.getCurrentRecord[this.tableNameCurrentTab + '_ID']
          }, { root: true })
            .then(response => {
              this.$message({
                type: 'success',
                message: this.$t('data.lockRecord').toString(),
                showClose: true
              })
              if (response && response.isPrivateAccess) {
                this.validatePrivateAccess(response)
              }
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: this.$t('notifications.error') + error.message,
                showClose: true
              })
            })
        }
      } else if (action && action.type && action.type === 'updateReport') {
        this.updateReport(action)
      }
    }

    openReference(referenceElement: any): void {
      if (referenceElement.windowUuid && referenceElement.recordUuid) {
        const viewSearch = recursiveTreeSearch({
          treeData: this.permissionRoutes,
          attributeValue: referenceElement.windowUuid,
          attributeName: 'meta',
          secondAttribute: 'uuid',
          attributeChilds: 'children'
        })
        if (viewSearch) {
          this.$router.push({
            name: viewSearch.name,
            query: {
              action: referenceElement.type,
              referenceUuid: referenceElement.uuid,
              recordUuid: referenceElement.recordUuid,
              // windowUuid: this.parentUuid,
              tabParent: (0).toString()
            }
          }, () => {})
        } else {
          this.$message({
            type: 'error',
            message: this.$t('notifications.noRoleAccess').toString(),
            showClose: true
          })
        }
      }
    }

    clipboardMessage(message: string): void {
      this.$message({
        message: message,
        type: 'success',
        showClose: true,
        duration: 1500
      })
    }

    fallbackCopyTextToClipboard(text: string): void {
      const textArea: HTMLTextAreaElement = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        if (document.execCommand('copy')) {
          this.clipboardMessage(this.$t('notifications.copySuccessful').toString())
        }
      } catch (err) {
        this.clipboardMessage(this.$t('notifications.copyUnsuccessful').toString())
      }
      document.body.removeChild(textArea)
    }

    activeClipboard(text: string): void {
      if (!navigator.clipboard) {
        this.fallbackCopyTextToClipboard(text)
        return
      }
      navigator.clipboard.writeText(text)
        .then(() => {
          this.clipboardMessage(this.$t('notifications.copySuccessful').toString())
        })
        .catch(() => {
          this.clipboardMessage(this.$t('notifications.copyUnsuccessful').toString())
        })
      navigator.clipboard.writeText(text)
    }

    setShareLink(): void {
      let shareLink: string = this.isWindow || window.location.href.includes('?') ? `${window.location.href}&` : `${window.location.href}?`
      if (this.$route.name === 'Report Viewer') {
        const processParameters = convertFieldsListToShareLink(this.processParametersExecuted!)
        const reportFormat = this.$store.getters[Namespaces.Utils + '/' + 'getReportType']
        shareLink = this.$store.getters[Namespaces.Utils + '/' + 'getTempShareLink']
        if (String(processParameters).length) {
          shareLink += '?' + processParameters
          shareLink += `&reportType=${reportFormat}`
        }
      } else {
        if (String(this.valuesPanelToShare).length) {
          shareLink += this.valuesPanelToShare
        }
        if (this.$route.query.action && this.$route.query.action !== 'create-new' && this.$route.query.action !== 'reference' && this.$route.query.action !== 'advancedQuery' && this.$route.query.action !== 'criteria') {
          shareLink = window.location.href
        }
      }
      if (shareLink !== this.$route.fullPath) {
        this.activeClipboard(shareLink)
      }
    }

    redirect(): void {
      const { uuid: name, tabParent } = ROUTES.PRINT_FORMAT_SETUP_WINDOW
      this.$router.push({
        name,
        query: {
          action: this.getReportDefinition!.output!.printFormatUuid,
          tabParent
        }
      }, () => {})
    }
}
