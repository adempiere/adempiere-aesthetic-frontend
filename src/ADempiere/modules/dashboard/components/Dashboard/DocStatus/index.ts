import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Mixins } from 'vue-property-decorator'
import { getPendingDocumentsFromServer } from '../../../DashboardService'
import {
  IPendingDocumentData,
  IPendingDocumentDataExtended,
  IPendingDocumentsFromServerResponse
} from '../../../DashboardType'
import MixinDasboard from '../MixinDashboard'
import Template from './template.vue'

@Component({
  name: 'PendingDocuments',
  mixins: [Template, MixinDasboard]
})
export default class PendingDocuments extends Mixins(MixinDasboard) {
    public documents: any[] = []

    // Computed properties
    get dataResult(): any[] {
      if (this.search.length) {
        return this.filterResult(this.search, this.documents)
      }
      return this.documents
    }

    // Methods
    getPendingDocuments(): Promise<IPendingDocumentDataExtended[]> {
      const userUuid = this.$store.state.user.userUuid // this.$store.getters['user/getUserUuid']
      const roleUuid = this.$store.state.user.role.uuid! // this.$store.getters.getRoleUuid
      return new Promise(resolve => {
        getPendingDocumentsFromServer({ userUuid, roleUuid })
          .then((response: IPendingDocumentsFromServerResponse) => {
            const documentsList: IPendingDocumentDataExtended[] = response.pendingDocumentsList.map(
              (documentItem: IPendingDocumentData) => {
                return {
                  ...documentItem,
                  name: documentItem.documentName,
                  description: documentItem.documentDescription
                }
              }
            )
            this.documents = documentsList
            resolve(documentsList)
          })
          .catch(error => {
            console.warn(
                        `Error getting pending documents: ${error.message}. Code: ${error.code}.`
            )
          })
      })
    }

    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === Namespaces.Dashboard + '/' + 'notifyDashboardRefresh') {
          this.getPendingDocuments()
        }
      })
    }

    handleClick(row: any) {
      const viewSearch = this.recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: row.windowUuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })

      if (viewSearch) {
        let tabParent
        if (row.action === 'window') {
          tabParent = 0
        }

        this.$router.push(
          {
            name: viewSearch.name,
            params: {
              ...row.criteria
            },
            query: {
              action: 'criteria',
              tabParent: String(tabParent)
            }
          }, undefined)
      } else {
        this.$message({
          type: 'error',
          message: this.$t('notifications.noRoleAccess').toString()
        })
      }
      // conditions for the registration amount (operador: row.criteria.whereClause)
    }

    // Hooks

    mounted() {
      this.getPendingDocuments()

      this.unsubscribe = this.subscribeChanges()
    }

    beforeDestroy() {
      this.unsubscribe()
    }
}
