import { IProcessData } from '@/ADempiere/modules/dictionary'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { recursiveTreeSearch } from '@/ADempiere/shared/utils/valueUtils'
import VueI18n from 'vue-i18n'
import { Component, Vue } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { INotificationProcessData } from '../../ProcessType'
import Template from './template.vue'

@Component({
  name: 'ProcessActivity',
  mixins: [Template]
})
export default class ProcessActivity extends Vue {
    public processActivity: any[] = []
    public recordCount = 0
    public pageToken = ''
    public pageSize = 50

    // Computed properties
    // process local not sent
    get getterAllInExecution(): any[] {
      return this.$store.getters[
        Namespaces.Process + '/' + 'getAllInExecution'
      ]
    }

    // process local and send with response
    get getterAllFinishProcess(): INotificationProcessData[] {
      return this.$store.getters[
        Namespaces.Process + '/' + 'getAllFinishProcess'
      ]
    }

    // session process from server
    get getterAllSessionProcess(): any[] {
      return this.$store.getters[
        Namespaces.Process + '/' + 'getAllSessionProcess'
      ]
    }

    // all process
    get getRunProcessAll(): any[] {
      const processAll = this.getterAllInExecution.concat(
        this.getterAllFinishProcess,
        this.getterAllSessionProcess
      )
      const processAllReturned: any[] = []

      processAll.forEach(element => {
        const processMetadataReturned: any = {}
        let infoMetadata: Partial<IProcessData> | undefined = this.getProcessMetadata(element.processUuid)
        if (!infoMetadata) {
          infoMetadata = {}
        }
        Object.assign(processMetadataReturned, element, infoMetadata)
        processMetadataReturned.parametersList = element.parametersList
        const indexRepeat = processAllReturned.findIndex(
          item => item.instanceUuid === element.instanceUuid && (element.instanceUuid)
        )
        if (indexRepeat > -1) {
          // update attributes in exists process to return
          // Object.assign(processAllReturned[indexRepeat], processMetadataReturned)
          const other = Object.assign(
            processMetadataReturned,
            processAllReturned[indexRepeat]
          )
          processAllReturned[indexRepeat] = other
          return
        }

        // add new process to show
        processAllReturned.push(processMetadataReturned)
      })
      return processAllReturned
        .sort((a, b) => {
          // sort by date and reverse string to order by most recently
          return new Date(a.lastRun).getTime() - new Date(b.lastRun).getTime()
        })
        .reverse()
    }

    get getProcessLog(): any[] {
      const log = this.getRunProcessAll.filter(element => {
        if (
          element.isError !== undefined &&
                element.isProcessing !== undefined
        ) {
          return element
        }
      })
      return log
    }

    get language(): string {
      return this.$store.state.app.language
    }

    get permissionRoutes(): RouteConfig[] {
      return this.$store.getters.permission_routes
    }

    // Methods
    getProcessMetadata(uuid: string): IProcessData | undefined {
      return this.$store.getters[Namespaces.ProcessDefinition + '/' + 'getProcess'](uuid)
    }

    handleCommand(activity: any): void {
      if (activity.command === 'seeReport') {
        this.$router.push({
          name: 'Report Viewer',
          params: {
            processId: activity.processId,
            instanceUuid: activity.instanceUuid,
            fileName: activity.output.fileName
          }
        },
        () => {})
      } else if (activity.command === 'zoomIn') {
        const viewSearch = recursiveTreeSearch({
          treeData: this.permissionRoutes,
          attributeValue: activity.uuid,
          attributeName: 'meta',
          secondAttribute: 'uuid',
          attributeChilds: 'children'
        })
        if (viewSearch) {
          this.$router.push({
            name: viewSearch.name,
            query: {
              ...this.$route.query,
              ...activity.parametersList
            }
          }, () => {})
        }
      }
    }

    checkStatus(params: { isError: boolean, isProcessing: boolean, isReport: boolean }): {
          text: string
          type: string
          color: string
      } {
      const { isError, isProcessing, isReport } = params
      const status = {
        text: this.$t('notifications.completed').toString(),
        type: 'success',
        color: '#67C23A'
      }
      // if (isReport) {
      //   return status
      // }
      // is executing
      if (isProcessing) {
        status.text = this.$t('notifications.processing').toString()
        status.type = 'info'
        status.color = '#909399'
        return status
      }
      if (isError) {
        status.text = this.$t('notifications.error').toString()
        status.type = 'danger'
        status.color = '#F56C6C'
        return status
      }
      // is completed
      return status
    }

    generateTitle(title: string): VueI18n.TranslateResult {
      const hasKey: boolean = this.$te('table.ProcessActivity.' + title)
      if (hasKey) {
        // $t :this method from vue-i18n, inject in @/lang/index.js
        const translatedTitle = this.$t('table.ProcessActivity.' + title)
        return translatedTitle
      }
      return title
    }

    translateDate(value: string | number | Date): string {
      return this.$d(new Date(value), 'long', this.language)
    }

    // Hooks
    beforeMount() {
      this.$store.dispatch(Namespaces.Process + '/' + 'getSessionProcessFromServer', {
        pageToken: this.pageToken,
        pageSize: this.pageSize
      }, { root: true })
        .then(response => {
          if (response.nextPageToken !== this.pageToken) {
            this.pageToken = response.nextPageToken
          }
        })
    }
}
