import { IPrivateAccessDataExtended } from '@/ADempiere/modules/persistence'
import MainPanel from '@/ADempiere/shared/components/Panel'
import { parseContext } from '@/ADempiere/shared/utils/contextUtils'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import MixinTab from './MixinTab'
import Template from './template.vue'

@Component({
  name: 'TabParent',
  mixins: [MixinTab, Template],
  components: {
    MainPanel
  }
})
export default class TabParent extends Mixins(MixinTab) {
    public currentTab: any = this.$route.query.tabParent || ''
    public lock = false

    // Computed properties
    tabParentStyle(): {
        height: string
        overflow: string
        } {
      // if tabs children is showed or closed
      if (this.windowMetadata.isShowedTabsChildren) {
        return {
          height: '100%',
          overflow: 'hidden'
        }
      }
      return {
        height: '75vh',
        overflow: 'auto'
      }
    }

    // Watchers
    @Watch('$route.query.tabParent')
    handleRouteQueryTabParentChange(actionValue: any) {
      if (!actionValue || actionValue === 'create-new') {
        this.currentTab = '0'
        return
      }
      this.currentTab = actionValue
    }

    @Watch('currentTab')
    handleCurrentTabChange(
      newValue: string | (string | null)[],
      oldValue: string | (string | null)[]
    ) {
      if (newValue !== oldValue) {
        this.$router.push(
          {
            query: {
              ...this.$route.query,
              tabParent: String(newValue)
            },
            params: {
              ...this.$route.params
            }
          }, () => {})

        this.$route.meta.tabUuid = this.tabUuid
      }
    }

    @Watch('tabUuid')
    handleTabUuidChange(value: string) {
      this.setCurrentTab()
    }

    @Watch('record')
    handleRecordChange(value: any) {
      const tableName = this.windowMetadata.firstTab.tableName
      if (value) {
        this.$store.dispatch(Namespaces.BusinessData + '/' + 'getPrivateAccessFromServer', {
          tableName,
          recordId: this.record[tableName + '_ID'],
          recordUuid: this.record.UUID
        })
          .then((privateAccessResponse: IPrivateAccessDataExtended) => {
            this.lock = privateAccessResponse.isLocked
          })
      }
    }

    // Methods
    lockRecord() {
      this.lock = !this.lock
      const tableName = this.windowMetadata.firstTab.tableName
      const action = this.lock ? 'lockRecord' : 'unlockRecord'
      const message = !this.lock ? 'lockRecord' : 'unlockRecord'
      this.$store.dispatch(Namespaces.BusinessData + '/' + action, {
        tableName,
        recordId: this.record[tableName + '_ID'],
        recordUuid: this.record.UUID
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: this.$t('data.' + message).toString(),
            showClose: true
          })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: this.$t('data.isError').toString() + this.$t('data.' + message).toString(),
            showClose: true
          })
        })
    }

    setCurrentTab(): void {
      this.$store.dispatch(Namespaces.WindowDefinition + '/' + 'setCurrentTab', {
        parentUuid: this.windowUuid,
        containerUuid: this.tabUuid,
        window: this.windowMetadata
      })
      this.$route.meta.tabUuid = this.tabUuid
    }

    handleBeforeLeave(activeName: string): void {
      const tabIndex: number = parseInt(activeName, 10)
      const metadataTab = this.tabsList.find(
        tab => tab.tabParentIndex === tabIndex
      )
      if (metadataTab.whereClause && metadataTab.whereClause.includes('@')) {
        metadataTab.whereClause = parseContext({
          parentUuid: metadataTab.parentUuid,
          containerUuid: metadataTab.uuid,
          value: metadataTab.whereClause,
          isBooleanToString: true
        }).value
      }
    }
}
