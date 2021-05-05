import { convertAction } from '@/ADempiere/shared/utils/DictionaryUtils'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { getLanguage } from '@/utils/cookies'
import { Component, Mixins } from 'vue-property-decorator'
import { requestListRecentItems } from '../../../DashboardService'
import { IRecentItemData, IRecentItemDataExtended, IRecentItemResponseData } from '../../../DashboardType'
import MixinDasboard from '../MixinDashboard'
import Template from './template.vue'

@Component({
  name: 'RecentItems',
  mixins: [
    MixinDasboard,
    Template
  ]
})
export default class RecentItems extends Mixins(MixinDasboard) {
    public recentItems: IRecentItemDataExtended[] = []
    public isLoaded = true

    // Computed Properties
    get dataResult() {
      if (this.search.length) {
        return this.filterResult(this.search, this.recentItems)
      }
      return this.recentItems
    }

    get userUuid(): string {
      return this.$store.state.user.userUuid
      // return this.$store.getters['user/getUserUuid']
    }

    get roleUuid(): string {
      return this.$store.state.user.role.uuid!
      // return this.$store.getters['user/getRole'].uuid
    }

    // Methods
    getRecentItems(params: { pageToken?: string, pageSize?: number }): Promise<IRecentItemDataExtended[]> {
      const { pageSize, pageToken } = params
      return new Promise(resolve => {
        requestListRecentItems({
          userUuid: this.userUuid,
          roleUuid: this.roleUuid,
          pageToken,
          pageSize
        })
          .then((response: IRecentItemResponseData) => {
            const recentItems: IRecentItemDataExtended[] = response.recentItemsList.map((item: IRecentItemData) => {
              const actionConverted = convertAction(item.action)

              return {
                ...item,
                action: actionConverted.name,
                icon: actionConverted.icon,
                uuidRecord: item.uuidRecord,
                updated: new Date(item.updated),
                uuid: item.menuUuid,
                name: item.menuName,
                description: item.menuDescription
              }
            })
            this.recentItems = recentItems
            this.isLoaded = false
            resolve(recentItems)
          })
          .catch(error => {
            console.warn(`Error getting recent items: ${error.message}. Code: ${error.code}.`)
          })
      })
    }

    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === Namespaces.Dashboard + '/' + 'notifyDashboardRefresh') {
          this.getRecentItems({})
        }
      })
    }

    translateDate(value: string | number | Date): string {
      return this.$d(new Date(value), 'long', getLanguage())
    }

    // Hooks
    mounted() {
      this.getRecentItems({})

      this.unsubscribe = this.subscribeChanges()
    }

    beforeDestroy() {
      this.unsubscribe()
    }
}
