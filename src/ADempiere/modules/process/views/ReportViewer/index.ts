import { IProcessData } from '@/ADempiere/modules/dictionary'
import { IReportOutputData } from '@/ADempiere/modules/report'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { showNotification } from '@/ADempiere/shared/utils/notifications'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { SettingsModule } from '@/store/modules/settings'
import { Component, Vue } from 'vue-property-decorator'
import { INotificationProcessData } from '../../ProcessType'
import Template from './template.vue'
import { reportFormatsList } from '@/ADempiere/shared/utils/exportUtil'

@Component({
  name: 'ReportViewer',
  mixins: [Template]
})
export default class ReportViewer extends Vue {
    public panelType: PanelContextType = PanelContextType.Process
    public processMetadata: Partial<IProcessData> = {}
    public reportFormat?: string = ''
    public reportContent?: string | IReportOutputData = ''
    public isLoading = false
    public reportResult?: Partial<INotificationProcessData> = {}
    public reportFormatsList: string[] = reportFormatsList

    // Computed properties
    // TODO: Add get metadata from server to open report view from link
    get showContextMenu(): boolean | undefined {
      return SettingsModule.showContextMenu
    }

    get getterProcess(): IProcessData | undefined {
      return this.$store.getters[
        Namespaces.ProcessDefinition + '/' + 'getProcessById'
      ](this.$route.params.processId)
    }

    get reportTitle(): string {
      return this.processMetadata.name || this.$route.meta.title
    }

    get url(): string {
      const processResult = this.$store.getters[
        Namespaces.Process + '/' + 'getProcessResult'
      ]
      return processResult.url
    }

    get getterCachedReport(): INotificationProcessData | undefined {
      return this.$store.getters[
        Namespaces.Process + '/' + 'getCachedReport'
      ](this.$route.params.instanceUuid)
    }

    // Methods
    showNotification = showNotification

    displayReport(reportResult: INotificationProcessData): void {
      if (!reportResult.isError) {
        const { output } = reportResult
        if (output) {
          this.reportFormat = !output.reportType
            ? reportResult.reportExportType
            : output.reportType
          this.reportContent = !output.output
            ? reportResult.output
            : output.output
        }

        this.isLoading = true
      }
    }

    getCachedReport(): void {
      this.reportResult = this.getterCachedReport
      if (this.reportResult === undefined) {
        const pageSize = undefined
        const pageToken = undefined
        this.$store.dispatch(Namespaces.Process + '/' + 'getSessionProcessFromServer', {
          pageSize,
          pageToken
        }, { root: true })
          .then(response => {
            this.reportResult = this.getterCachedReport
            if (this.reportResult === undefined) {
              this.showNotification({
                type: 'error',
                title: 'error',
                message: 'requestError'
              })

              this.$store
                .dispatch('tagsView/delView', this.$route)
                .then(() => {
                  this.$router.push('/')
                })
              return
            }
            this.displayReport(this.reportResult)
          })
      } else {
        this.displayReport(this.reportResult)
      }
    }

    // Hooks
    created() {
      this.processMetadata = this.getterProcess || {}
    }

    mounted() {
      this.getCachedReport()
      this.$route.meta.reportFormat = this.reportFormat
    }
}
