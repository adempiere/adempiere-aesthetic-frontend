import ContextMenu from '@/ADempiere/modules/window/components/ContextMenu'
import DataTable from '@/ADempiere/shared/components/DataTable'
import ModalDialog from '@/ADempiere/shared/components/Dialog'
import MainPanel from '@/ADempiere/shared/components/Panel'
import Template from './template.vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IBrowserDataExtended } from '@/ADempiere/modules/dictionary'
import { IRecordSelectionData } from '../../PersistenceType'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { SettingsModule } from '@/store/modules/settings'
import { AppModule, DeviceType } from '@/store/modules/app'

@Component({
  name: 'BrowserView',
  mixins: [Template],
  components: {
    MainPanel,
    DataTable,
    ContextMenu,
    ModalDialog
  }
})
export default class BrowserView extends Vue {
    @Prop({ type: Boolean, default: false }) isEdit = false
    public browserMetadata: Partial<IBrowserDataExtended> = {}
    public browserUuid: string = this.$route.meta.uuid
    public activeSearch: any[] = []
    public isLoaded = false
    public panelType: PanelContextType = PanelContextType.Browser

    // Computed properties
    get showContextMenu(): boolean | undefined {
      return SettingsModule.showContextMenu
    }

    get getterBrowser(): IBrowserDataExtended | undefined {
      return this.$store.getters[Namespaces.BrowserDefinition + '/' + 'getBrowser'](this.browserUuid)
    }

    get browserTitle(): string {
      return this.browserMetadata.name || this.$route.meta.title
    }

    get isLoadedRecords(): boolean {
      const recordAndSelection: IRecordSelectionData = this.$store.getters[Namespaces.BusinessData + '/' + 'getDataRecordAndSelection'](
        this.browserUuid
      )
      return recordAndSelection.isLoaded
    }

    get isReadyToSearch(): boolean {
      if (this.browserMetadata.awaitForValuesToQuery) {
        return false
      }
      return !this.$store.getters[Namespaces.Panel + '/' + 'isNotReadyForSubmit'](this.browserUuid)
    }

    get isMobile(): boolean {
      return AppModule.device === DeviceType.Mobile
    }

    get cssClassTitle(): 'title-mobile' | 'title' {
      if (this.isMobile) {
        return 'title-mobile'
      }
      return 'title'
    }

    get cssClassHelp(): 'content-help-mobile' | 'content-help' {
      if (this.isMobile) {
        return 'content-help-mobile'
      }
      return 'content-help'
    }

    get isShowedCriteria(): boolean {
      if (this.browserMetadata) {
        return this.browserMetadata.isShowedCriteria!
      }
      return false
    }

    // Watchers
    @Watch('isShowedCriteria')
    handleIsShowedCriteriaChange(value: boolean) {
      this.handleCollapse(value)
    }

    // Methods
    handleChange() {
      let showCriteria = false
      if (this.activeSearch.length) {
        showCriteria = true
      }
      this.$store.dispatch('changeBrowserAttribute', {
        containerUuid: this.browserUuid,
        attributeName: 'isShowedCriteria',
        attributeValue: showCriteria
      })
    }

    /**
     * Manage open or closed component collapse of criteria
     */
    handleCollapse(isShowedCriteria: boolean): void {
      // by default criteria if closed
      const activeSearch = []
      if (isShowedCriteria) {
        // open criteria
        activeSearch.push('opened-criteria')
      }
      this.activeSearch = activeSearch
    }

    getBrowser(): void {
      const browser: IBrowserDataExtended | undefined = this.getterBrowser
      if (browser) {
        this.browserMetadata = browser
        this.isLoaded = true
        this.defaultSearch()
        return
      }
      this.$store.dispatch(Namespaces.Panel + '/' + 'getPanelAndFields', {
        containerUuid: this.browserUuid,
        panelType: this.panelType,
        routeToDelete: this.$route
      })
        .then(browserResponse => {
          this.browserMetadata = browserResponse
          this.handleCollapse(browserResponse.isShowedCriteria)
          this.defaultSearch()
        })
        .finally(() => {
          this.isLoaded = true
        })
    }

    defaultSearch(): void {
      if (this.isLoadedRecords) {
        // not research
        return
      }

      if (this.isReadyToSearch) {
        // first search by default
        this.$store.dispatch('getBrowserSearch', {
          containerUuid: this.browserUuid
        })
        return
      }

      // set default values into data
      this.$store.dispatch('setRecordSelection', {
        containerUuid: this.browserUuid,
        panelType: this.panelType
      })
    }

    // Hooks
    created() {
      this.getBrowser()
      SettingsModule.ChangeSetting({
        key: 'showContextMenu',
        value: true
      })
    }
}
