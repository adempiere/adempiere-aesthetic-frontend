import { isEmptyValue, recursiveTreeSearch } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'MixinDasboard'
})
export default class MixinDasboard extends Vue {
    @Prop({ type: Object, required: true }) metadata: any
    public search = ''
    public documents?: any[]

    // Computed properties
    get permissionRoutes() {
      return this.$store.state.permission.routes
    }

    // Methods

    unsubscribe = (): void => { return undefined }

    recursiveTreeSearch = recursiveTreeSearch

    handleClick(row: any) {
      const viewSearch = this.recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: row.referenceUuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })

      if (viewSearch) {
        let recordUuid
        if (!isEmptyValue(row.uuidRecord)) {
          recordUuid = row.uuidRecord
        }
        let tabParent = ''
        if (row.action === 'window') {
          tabParent = String(0)
        }

        this.$router.push({
          name: viewSearch.name,
          query: {
            action: recordUuid,
            tabParent
          }
        }, () => {})
      } else {
        this.$message({
          type: 'error',
          message: this.$t('notifications.noRoleAccess').toString()
        })
      }
    }

    ignoreAccent(s: string): string {
      if (!s) {
        return ''
      }
      return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }

    filterResult(search: string, list: any[]): any[] {
      const searchFilter: string = this.ignoreAccent(search.toLowerCase())
      return list.filter(data => !searchFilter || data.name.toLowerCase().includes(searchFilter.toLowerCase()))
    }
}
