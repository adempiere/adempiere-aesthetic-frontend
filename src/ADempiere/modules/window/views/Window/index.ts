import Template from './template.vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import C2 from 'vue-class-component'
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
import { ActionContextName, PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { Route } from 'vue-router'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { IWindowDataExtended } from '@/ADempiere/modules/dictionary'
import { IEntityLogData, IWorkflowProcessData } from '../../WindowType'
import { IRecordSelectionData } from '@/ADempiere/modules/persistence'
import { DeviceType } from '@/ADempiere/modules/app/AppType'
import RightPanel from '@/ADempiere/modules/window/components/RightPanel'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import RecordAccess from '@/ADempiere/modules/privateAccess/components/RecordAccess'
import Embedded from '@/ADempiere/shared/components/Dialog/Embedded'
import ListChatEntry from '@/ADempiere/modules/window/components/ChatEntries/ListChatEntry'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

C2.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

@Component({
  name: 'WindowView',
  mixins: [Template],
  components: {
    TabParent,
    TabChildren,
    ContextMenu,
    DataTable,
    ChatEntries,
    ListChatEntry,
    RecordLogs,
    WorkflowLogs,
    WorkflowStatusBar,
    SplitPane,
    ModalDialog,
    RightPanel,
    RecordAccess,
    Embedded
  }
})
export default class WindowView extends Vue {
  // eslint-disable-next-line
    @Prop({ type: Object, default: () => {} }) styleSteps: any
    public windowMetadata: Partial<IWindowDataExtended> = {}
    public windowUuid = ''
    public panelType: PanelContextType = PanelContextType.Window
    public isLoaded = false
    // TODO: Manage attribute with store
    public activeInfo = 'listChatEntries'
    public showContainerInfo = false
    // TODO: Manage attribute with store
    public isShowedRecordPanel = false

    // Computed properties
    get currentFieldOption() {
      return this.$store.getters[Namespaces.ContextMenu + '/' + 'getFieldContextMenu']
    }

    get panelContextMenu(): boolean {
      return this.$store.state.contextMenuModule.isShowRightPanel
    }

    get componentRender() {
      let component
      switch (this.currentFieldOption.name) {
        case this.$t('field.info'):
          component = () => import('@/ADempiere/shared/components/Field/FieldOptions/ContextInfo')
          break
        case this.$t('language'):
          component = () => import('@/ADempiere/shared/components/Field/FieldOptions/Translated')
          break
        case this.$t('field.calculator'):
          component = () => import('@/ADempiere/shared/components/Field/FieldOptions/Calculator')
          break
        case this.$t('field.preference'):
          component = () => import('@/ADempiere/shared/components/Field/FieldOptions/Preference')
          break
        case this.$t('field.logsField'):
          component = () => import('@/ADempiere/shared/components/Field/FieldOptions/ChangeLogs')
          break
        case this.$t('operators.operator'):
          component = () => import('@/ADempiere/shared/components/Field/FieldOptions/OperatorComparison')
          break
      }
      return component
    }

    get showRecordAccess(): boolean {
      if (this.$route.query.typeAction === 'recordAccess') {
        this.$store.commit(Namespaces.ContextMenu + '/' + 'changeShowRigthPanel', true)
        return true
      }
      return this.$store.getters[Namespaces.ContextMenu + '/' + 'getShowRecordAccess']
    }

    get isNewRecord(): boolean {
      return (
        isEmptyValue(this.$route.query) ||
        isEmptyValue(this.$route.query.action) ||
        this.$route.query.action === 'create-new'
      )
    }

    get showContextMenu(): boolean | undefined {
      return this.$store.state.settings.showContextMenu
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
      return this.$store.state.app.device === DeviceType.Mobile
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
      return this.windowMetadata.isShowedTabsChildren!
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
      if (isEmptyValue(changeLog)) {
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
      if (isEmptyValue(this.gettersListRecordLogs)) {
        return false
      }
      return true
    }

    get getIsWorkflowLog(): boolean {
      const workflowLogs: IWorkflowProcessData[] = this.$store.getters[
        Namespaces.ContainerInfo + '/' + 'getNodeWorkflow'
      ]
      if (isEmptyValue(workflowLogs)) {
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
    get getRecord(): any {
      if (!this.isNewRecord) {
        const { action } = this.$route.query
        return this.getterDataRecords.find((record: any) => {
          return record.UUID === action
        })
      }
      return undefined
    }

    get recordId() {
      const currentRecord = this.getRecord
      if (isEmptyValue(currentRecord)) {
        return undefined
      }
      return currentRecord[`${this.getTableName}_ID`]
    }

    get currentRecord() {
      const currentRecord = this.$store.getters[
        Namespaces.Window + '/' + 'getCurrentRecord'
      ]
      if (isEmptyValue(currentRecord)) {
        return this.getterDataRecords[0]
      }
      return currentRecord
    }

    get isDocumentTab(): boolean {
      const panel = isEmptyValue(this.windowMetadata.currentTabUuid) ? '' : this.$store.getters[Namespaces.Panel + '/' + 'getPanel'](this.windowMetadata.currentTabUuid)
      if (!isEmptyValue(panel)) {
        return panel.isDocument
      }

      return this.windowMetadata.firstTab!.isDocument
    }

    get isWorkflowBarStatus(): boolean {
      const panel = isEmptyValue(this.windowMetadata.currentTabUuid) ? '' : this.$store.getters[Namespaces.Panel + '/' + 'getPanel'](
        this.windowMetadata.currentTabUuid
      )
      if (
        !isEmptyValue(panel) &&
            this.isDocumentTab &&
            !this.isNewRecord
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

    @Watch('getRecord')
    handleGetRecordChange(value: any) {
      if (value && this.getTableName && this.recordId && isEmptyValue(this.gettersListRecordLogs)) {
        this.$store.dispatch(Namespaces.ContainerInfo + '/' + 'listRecordLogs', {
          tableName: this.getTableName,
          recordId: this.recordId,
          recordUuid: value.UUID
        })
      }
      if (!isEmptyValue(this.windowMetadata.currentTab?.tableName) && !isEmptyValue(value) && (!isEmptyValue(this.$route.query) && this.$route.query.typeAction === ActionContextName.RecordAccess)) {
        this.$store.commit(Namespaces.ContextMenu + '/' + 'setRecordAccess', true)
      }
      if (!isEmptyValue(this.windowMetadata?.currentTab?.tableName) && !isEmptyValue(value) && this.isMobile) {
        const posibleActions = ['listWorkflowLogs', 'listRecordLogs']
        if (posibleActions.includes(this.activeInfo)) {
          this.$store.dispatch(Namespaces.ContainerInfo + '/' + this.activeInfo, {
            tableName: this.getTableName,
            recordId: this.recordId,
            recordUuid: value.UUID
          })
        } else {
          this.$store.dispatch(Namespaces.ChatEntries + '/' + this.activeInfo, {
            tableName: this.getTableName,
            recordId: this.recordId,
            recordUuid: value.UUID
          })
        }
      }
    }

    // Hooks
    created() {
      this.windowUuid = this.$route.meta.uuid
      if (!isEmptyValue(this.currentRecord) && (!isEmptyValue(this.$route.query) && this.$route.query.typeAction === ActionContextName.RecordAccess)) {
        this.$store.commit('setRecordAccess', true)
      }
      this.getWindow()
      if (this.isShowedRecordNavigation) {
        this.handleResize()
      }
      this.$store.dispatch(Namespaces.Settings + '/' + 'ChangeSetting', {
        key: 'showContextMenu',
        value: true
      })
    }

    // Methods
    handleResize(): void {
      const panelRight: HTMLElement | null = document.getElementById(
        'PanelRight'
      )
      if (!isEmptyValue(panelRight)) {
        const widthPanel: number = panelRight!.clientWidth - 350
        this.$store.commit(Namespaces.WindowDefinition + '/' + 'setPanelRight', String(widthPanel))
      }
    }

    contentInfo(): void {
      this.showContainerInfo = !this.showContainerInfo
      if (this.showContainerInfo) {
        let tableName: string = this.$route.params.tableName
        if (isEmptyValue(tableName)) {
          tableName = this.getTableName!
        }

        const record = this.currentRecord
        let recordId = ''
        if (!isEmptyValue(record)) {
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
          }, () => {})

        let recordUuid
        if (!this.isNewRecord) {
          recordUuid = this.$route.query.action
        }
        // TODO: Verify if first tab is document
        if (this.isDocumentTab) {
          this.$store.dispatch(Namespaces.ContainerInfo + '/' + 'listWorkflowLogs', {
            tableName,
            recordUuid,
            recordId
          })
        }
        const posibleActions = ['listWorkflowLogs', 'listRecordLogs']
        if (posibleActions.includes(this.activeInfo)) {
          this.$store.dispatch(Namespaces.ContainerInfo + '/' + this.activeInfo, {
            tableName,
            recordId,
            recordUuid
          })
        } else {
          this.$store.dispatch(Namespaces.ChatEntries + '/' + this.activeInfo, {
            tableName,
            recordId,
            recordUuid
          })
        }
      }
      this.$store.dispatch(Namespaces.Utils + '/' + 'showContainerInfo', !this.getterShowContainerInfo)
    }

    handleClick(tab: any, event: any) {
      let tableName: string | undefined = this.$route.params.tableName
      if (isEmptyValue(tableName)) {
        tableName = this.getTableName
      }

      let recordUuid
      if (!this.isNewRecord) {
        recordUuid = this.$route.query.action
      }

      const record = this.currentRecord
      let recordId = 0
      if (!isEmptyValue(record)) {
        recordId = record[tableName + '_ID']
      }

      let tabNameWithModule = ''

      // switch(tab.name){
      //   case 'listRecordLogs': tabNameWithModule = Namespaces.ContainerInfo + '/' + tab.name
      //   break
      //   case 'listWorkflowLogs': tabNameWithModule = Namespaces.ContainerInfo + '/' + tab.name
      //   default: tabNameWithModule = tab.name
      //   break
      // }
      switch (tab.name) {
        case 'listRecordLogs':
          tabNameWithModule = Namespaces.ContainerInfo + '/' + tab.name
          break
        case 'listWorkflowLogs':
          tabNameWithModule = Namespaces.ContainerInfo + '/' + tab.name
          break
        case 'listChatEntries':
          tabNameWithModule = Namespaces.ChatEntries + '/' + tab.name
          break
        default:
          tabNameWithModule = Namespaces.ContainerInfo + '/' + tab.name
          break
      }

      this.$store.dispatch(tabNameWithModule, {
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
                    !this.isNewRecord) ||
                this.$route.query.action === 'advancedQuery'
        ) {
          isShowRecords = true
        } else if (
          this.windowMetadata.windowType === 'T' ||
                this.isNewRecord
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
      const tableName = this.getTableName
      let recordId = 0
      if (!isEmptyValue(record)) {
        recordId = record[tableName + '_ID']
      }
      if (this.isDocumentTab) {
        this.$store.dispatch(Namespaces.ContextMenu + '/' + 'listDocumentStatus', {
          tableName,
          recordUuid: this.$route.query.action,
          recordId
        })
      }
    }

    handleChangeShowedRecordNavigation(valueToChange: any): void {
      const panelRight: HTMLElement = document.getElementById('PanelRight')!
      const heightPanel = panelRight?.clientHeight + 50
      this.$store.dispatch(Namespaces.Utils + '/' + 'setHeight', heightPanel)
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
      console.log('click button')
      console.log(isShowedChilds)
      console.log('data to send')
      console.log({
        parentUuid: this.windowUuid, // act as parentUuid
        window: this.windowMetadata,
        attributeName: 'isShowedTabsChildren',
        attributeValue: isShowedChilds
      })
      console.warn({
        isShowedTabsChildren: this.isShowedTabsChildren
      })

      this.$store.dispatch(Namespaces.WindowDefinition + '/' + 'changeWindowAttribute', {
        parentUuid: this.windowUuid, // act as parentUuid
        window: this.windowMetadata,
        attributeName: 'isShowedTabsChildren',
        attributeValue: isShowedChilds
      })
      console.warn({
        isShowedTabsChildren2: this.isShowedTabsChildren
      })
    }
}
