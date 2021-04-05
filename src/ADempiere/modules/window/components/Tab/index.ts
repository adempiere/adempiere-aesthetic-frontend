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
          },
          undefined
        )

        this.$route.meta.tabUuid = this.tabUuid
      }
    }

    @Watch('tabUuid')
    handleTabUuidChange(value: string) {
      this.setCurrentTab()
    }

    // Methods
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
