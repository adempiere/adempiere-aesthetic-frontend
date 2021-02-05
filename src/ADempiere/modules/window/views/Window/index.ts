import Template from './template.vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import TabParent from '../../components/Tab'
import TabChildren from '../../components/Tab/TabChildren'
import ContextMenu from '../../components/ContextMenu'
import DataTable from '@/ADempiere/shared/components/DataTable'
import ChatEntries from '../../components/ChatEntries'
import RecordLogs from '../../components/ContainerInfo/RecordLogs'
import WorkflowLogs from '../../components/ContainerInfo/WorkflowLogs'
import WorkflowStatusBar from '@/ADempiere/shared/components/WorkflowStatusBar'
import SplitPane from 'vue-splitpane'
import ModalDialog from '@/ADempiere/shared/components/Dialog'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { Route } from 'vue-router'
import { SettingsModule } from '@/store/modules/settings'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { IWindowDataExtended } from '@/ADempiere/modules/dictionary'
import { IEntityLogData, IWorkflowProcessData } from '../../WindowType'
import { IRecordSelectionData } from '@/ADempiere/modules/persistence'
import { AppModule, DeviceType } from '@/store/modules/app'

@Component({
  name: 'WindowView',
  mixins: [Template],
  components: {
    TabParent,
    TabChildren,
    ContextMenu,
    DataTable,
    ChatEntries,
    RecordLogs,
    WorkflowLogs,
    WorkflowStatusBar,
    SplitPane,
    ModalDialog
  }
})
export default class WindowView extends Vue {
  // eslint-disable-next-line
    @Prop({ type: Object, default: () => {} }) styleSteps: any
    public windowMetadata: Partial<IWindowDataExtended> = {}
    public windowUuid: string = this.$route.meta.uuid
    public panelType: PanelContextType = PanelContextType.Window
    public isLoaded = false
    // TODO: Manage attribute with store
    public activeInfo = 'listChatEntries'
    public showContainerInfo = false
    // TODO: Manage attribute with store
    public isShowedRecordPanel = false

    // Computed properties
    get showContextMenu(): boolean | undefined {
      return SettingsModule.showContextMenu
    }

    get defaultPorcentSplitPane() {
      if (this.isShowedRecordPanel) {
        if (this.isShowedRecordNavigation) {
          return 100
        }
        return 50
      }
      if (this.isShowedRecordNavigation) {
        if (this.isMobile) {
          return 100
        }
        return 50
      }
      return -1
    }

    get isMobile(): boolean {
      return AppModule.device === DeviceType.Mobile
    }

    // convert ternary operator into computed property
    get classIsMobile(): 'open-table-detail-mobile' | 'open-table-detail' {
      if (this.isMobile) {
        return 'open-table-detail-mobile'
      }
      return 'open-table-detail'
    }

    get isSize(): 98 | 50 {
      if (this.isMobile && this.showContainerInfo) {
        return 98
      }
      return 50
    }

    get sizePanel(): 2 | 50 | 100 {
      if (this.showContainerInfo) {
        if (this.isMobile) {
          return 2
        }
        return 50
      }
      return 100
    }

    get isCloseInfo(): 'close-info-mobile' | 'close-info' {
      if (this.isMobile) {
        return 'close-info-mobile'
      }
      return 'close-info'
    }

    get iconShowedRecordNavigation():
        | 'el-icon-caret-left'
        | 'el-icon-caret-right' {
      if (this.isShowedRecordNavigation) {
        return 'el-icon-caret-left'
      }
      return 'el-icon-caret-right'
    }

    get iconIsShowedAside(): 'el-icon-caret-left' | 'el-icon-caret-right' {
      if (this.isShowedRecordPanel) {
        return 'el-icon-caret-left'
      }
      return 'el-icon-caret-right'
    }

    get styleMainTab(): {
        height: string
        overflow: string
        } {
      if (this.isShowedTabsChildren) {
        return {
          height: 'initial',
          overflow: 'auto'
        }
      }
      return {
        height: 'initial',
        overflow: 'hidden'
      }
    }

    get styleTableNavigation():
        | 'open-datatable-aside-mobile'
        | 'open-datatable-aside' {
      if (this.isShowedRecordNavigation && this.isMobile) {
        return 'open-datatable-aside-mobile'
      }
      return 'open-datatable-aside'
    }

    get splitAreaStyle():
        | {
              overflowX: string
              overflowY: string
          }
        | {
              overflow: string
              } {
      if (this.isShowedTabsChildren || this.isMobile) {
        return {
          overflowX: 'hidden',
          overflowY: 'auto'
        }
      }
      return {
        overflow: 'hidden'
      }
    }

    get styleStepsSimple(): Partial<CSSStyleDeclaration> {
      const baseStyle: Partial<CSSStyleDeclaration> = {
        paddingTop: '0px',
        paddingBottom: '0px',
        paddingLeft: '0px',
        paddingRight: '0px',
        borderRadius: '4px',
        background: '#F5F7FA',
        overflowX: 'auto',
        overflowY: 'hidden'
      }
      if (this.isShowedRecordNavigation) {
        return {
          ...baseStyle,
          width:
                    this.$store.getters[
                      Namespaces.WindowDefinition + '/' + 'getPanelRight'
                    ] + 'px'
        }
      }
      return {
        ...baseStyle,
        width: 'auto'
      }
    }

    get sizeAreaStyle(): 50 | 110 {
      if (this.isShowedTabsChildren) {
        return 50
      }
      return 110
    }

    get getterWindow(): IWindowDataExtended | undefined {
      return this.$store.getters[
        Namespaces.WindowDefinition + '/' + 'getWindow'
      ](this.windowUuid)
    }

    get isShowedTabsChildren(): boolean {
      if (this.windowMetadata && this.windowMetadata.isShowedTabsChildren) {
        return this.windowMetadata.isShowedTabsChildren
      }
      return false
    }

    get isShowedRecordNavigation(): boolean {
      if (
        this.windowMetadata &&
            this.windowMetadata.isShowedRecordNavigation
      ) {
        return this.windowMetadata.isShowedRecordNavigation
      }
      return false
    }

    get getHeightPanelBottom(): number {
      return (
        this.$store.getters[Namespaces.Utils + '/' + 'getSplitHeight'] - 11
      )
    }

    get getterRecordList() {
      return this.$store.getters[
        Namespaces.BusinessData + '/' + 'getDataRecordsList'
      ](this.windowMetadata.currentTabUuid).length
    }

    get gettersListRecordLogs(): IEntityLogData[] {
      const recordLogs: {
            recordCount: number
            entityLogs: IEntityLogData[]
        } = this.$store.getters[Namespaces.ContainerInfo + '/' + 'getRecordLogs']

      const changeLog: IEntityLogData[] = recordLogs.entityLogs
      if (!changeLog) {
        return changeLog
      }
      // TODO: Verify it, parse date value
      changeLog.sort((a, b) => {
        const c = new Date(a.logDate)
        const d = new Date(b.logDate)
        return d.getTime() - c.getTime()
      })
      return changeLog
    }

    get getIsChangeLog(): boolean {
      if (!this.gettersListRecordLogs) {
        return false
      }
      return true
    }

    get getIsWorkflowLog(): boolean {
      const workflowLogs: IWorkflowProcessData[] = this.$store.getters[
        Namespaces.ContainerInfo + '/' + 'getNodeWorkflow'
      ]
      if (!workflowLogs) {
        return false
      }
      return true
    }

    get getterShowContainerInfo(): boolean {
      return this.$store.getters[
        Namespaces.Utils + '/' + 'getShowContainerInfo'
      ]
    }

    get getterDataRecordsAndSelection(): IRecordSelectionData {
      return this.$store.getters[
        Namespaces.BusinessData + '/' + 'getDataRecordAndSelection'
      ](this.windowMetadata.firstTabUuid)
    }

    get getterDataRecords(): any[] {
      return this.getterDataRecordsAndSelection.record
    }

    get getTableName(): string | undefined {
      if (
        this.windowMetadata &&
            this.windowMetadata.firstTab &&
            this.windowMetadata.firstTab.tableName
      ) {
        return this.windowMetadata.firstTab.tableName
      }
      return undefined
    }

    // current record
    get getRecord() {
      const { action } = this.$route.query
      if (action && action !== 'create-new') {
        return this.getterDataRecords.find(record => {
          return record.UUID === action
        })
      }
      return undefined
    }

    get recordId() {
      const currentRecord = this.getRecord
      if (!currentRecord) {
        return undefined
      }
      return currentRecord[`${this.getTableName}_ID`]
    }

    get currentRecord() {
      const currentRecord = this.$store.getters[
        Namespaces.Window + '/' + 'getCurrentRecord'
      ]
      if (!currentRecord) {
        return this.getterDataRecords[0]
      }
      return currentRecord
    }

    get isDocument(): boolean {
      const panel = this.$store.getters[Namespaces.Panel + '/' + 'getPanel'](this.windowMetadata.currentTabUuid)
      if (panel && this.isDocument && this.$route.query.action !== 'create-new') {
        return true
      }
      return false
    }

    get isWorkflowBarStatus(): boolean {
      const panel = this.$store.getters[Namespaces.Panel + '/' + 'getPanel'](
        this.windowMetadata.currentTabUuid
      )
      if (
        panel &&
            this.isDocument &&
            this.$route.query.action !== 'create-new'
      ) {
        return true
      }
      return false
    }

    // Navigation Guards

    beforeRouteUpdate(to: Route, from: Route, next: Function) {
      this.$store.dispatch(Namespaces.Window + '/' + 'setWindowOldRoute', {
        path: from.path,
        fullPath: from.fullPath,
        params: {
          ...from.params
        },
        query: {
          ...from.query
        }
      })
      next()
    }

    // Watchers
    @Watch('$route')
    handleRoute(value: Route) {
      if (this.showContainerInfo) {
        this.$store
          .dispatch(Namespaces.ChatEntries + '/' + this.activeInfo, {
            tableName: this.$route.params.tableName,
            recordId: this.$route.params.recordId
          })
          .then(response => {
            if (value.query.action === 'create-new') {
              this.$store.commit(Namespaces.ChatEntries + '/' + 'isNote', false)
            }
          })
      }
    }

    // Hooks
    created() {
      this.getWindow()
      if (this.isShowedRecordNavigation) {
        this.handleResize()
      }
      SettingsModule.ChangeSetting({
        key: 'showContextMenu',
        value: true
      })
    }

    // Methods
    handleResize(): void {
      const panelRight: HTMLElement | null = document.getElementById(
        'PanelRight'
      )
      if (panelRight) {
        const widthPanel: number = panelRight.clientWidth - 350
        this.$store.commit(Namespaces.WindowDefinition + '/' + 'setPanelRight', String(widthPanel))
      }
    }

    contentInfo(): void {
      this.showContainerInfo = !this.showContainerInfo
      if (this.showContainerInfo) {
        let tableName: string = this.$route.params.tableName
        if (!tableName) {
          tableName = this.getTableName!
        }

        const record = this.currentRecord
        let recordId = ''
        if (record) {
          recordId = record[tableName + '_ID']
        }
        this.$router.push(
          {
            params: {
              recordId,
              tableName
            },
            query: {
              ...this.$route.query
            }
          }
        )

        const action = this.$route.query.action
        let recordUuid
        if (action && action !== 'create-new') {
          recordUuid = action
        }
        // TODO: Verify if first tab is document
        this.$store.dispatch(Namespaces.ContainerInfo + '/' + 'listWorkflowLogs', {
          tableName,
          recordUuid,
          recordId
        })
        this.$store.dispatch(Namespaces.ChatEntries + '/' + this.activeInfo, {
          tableName,
          recordId,
          recordUuid
        })
      }
      this.$store.dispatch(Namespaces.Utils + '/' + 'showContainerInfo', !this.getterShowContainerInfo)
    }

    handleClick(tab: any, event: any) {
      let tableName: string | undefined = this.$route.params.tableName
      if (!tableName) {
        tableName = this.getTableName
      }

      const action = this.$route.query.action
      let recordUuid
      if (action && action !== 'create-new') {
        recordUuid = action
      }

      const record = this.currentRecord
      let recordId = ''
      if (record) {
        recordId = record[tableName + '_ID']
      }

      this.$store.dispatch(tab.name, {
        tableName,
        recordId,
        recordUuid
      })
    }

    // callback new size
    onDrag(size: any[]): void {
      this.$store.dispatch(Namespaces.Utils + '/' + 'setSplitHeightTop', {
        splitHeightTop: size[0]
      })
      this.$store.dispatch(Namespaces.Utils + '/' + 'setSplitHeight', {
        splitHeight: size[1]
      })
    }

    // get window from vuex store or server
    getWindow(): void {
      const window: IWindowDataExtended | undefined = this.getterWindow
      if (window) {
        this.generateWindow(window)
        return
      }
      this.$store
        .dispatch(Namespaces.WindowDefinition + '/' + 'getWindowFromServer', {
          windowUuid: this.windowUuid,
          routeToDelete: this.$route
        })
        .then((response: IWindowDataExtended) => {
          this.generateWindow(response)
        })
    }

    generateWindow(window: IWindowDataExtended): void {
      this.windowMetadata = window
      let isShowRecords = this.isShowedRecordNavigation
      if (isShowRecords === undefined) {
        if (
          (['M', 'Q'].includes(this.windowMetadata.windowType!) &&
                    this.getterRecordList >= 10 &&
                    this.$route.query.action !== 'create-new') ||
                this.$route.query.action === 'advancedQuery'
        ) {
          isShowRecords = true
        } else if (
          this.windowMetadata.windowType === 'T' ||
                this.$route.query.action === 'create-new'
        ) {
          isShowRecords = false
        } else if (this.$route.query.action === 'listRecords') {
          isShowRecords = true
          this.handleChangeShowedPanel(true)
        }
        this.handleChangeShowedRecordNavigation(isShowRecords)
      }
      this.isLoaded = true
      const record = this.currentRecord
      this.$store.dispatch(Namespaces.ContextMenu + '/' + 'listDocumentStatus', {
        tableName: this.getTableName,
        recordUuid: this.$route.query.action,
        recordId: record[this.getTableName + '_ID']
      })
    }

    handleChangeShowedRecordNavigation(valueToChange: any): void {
      this.$store.dispatch(Namespaces.WindowDefinition + '/' + 'changeWindowAttribute', {
        parentUuid: this.windowUuid, // act as parentUuid
        window: this.windowMetadata,
        attributeName: 'isShowedRecordNavigation',
        attributeValue: valueToChange
      })
    }

    handleChangeShowedPanel(value: any): void {
      this.isShowedRecordPanel = !this.isShowedRecordPanel
    }

    handleChangeShowedTabChildren(isShowedChilds: any): void {
      this.$store.dispatch(Namespaces.WindowDefinition + '/' + 'changeWindowAttribute', {
        parentUuid: this.windowUuid, // act as parentUuid
        window: this.windowMetadata,
        attributeName: 'isShowedTabsChildren',
        attributeValue: isShowedChilds
      })
    }
}
