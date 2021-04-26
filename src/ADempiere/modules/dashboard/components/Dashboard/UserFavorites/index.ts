import { convertAction } from '@/ADempiere/shared/utils/DictionaryUtils'
import { IActionAttributesData } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Mixins } from 'vue-property-decorator'
import { getFavoritesFromServer } from '../../../DashboardService'
import {
  IFavoriresFromServerResponse,
  IFavoriteData,
  IFavoriteDataExtended
} from '../../../DashboardType'
import MixinDasboard from '../MixinDashboard'
import Template from './template.vue'

@Component({
  name: 'Favorites',
  mixins: [Template, MixinDasboard]
})
export default class Favorites extends Mixins(MixinDasboard) {
    public favorites: any[] = []
    public isLoaded = true

    // Computed Properties
    get dataResult(): any[] {
      if (this.search.length) {
        return this.filterResult(this.search, this.favorites)
      }
      return this.favorites
    }

    // Methods
    getFavoritesList(): Promise<IFavoriteDataExtended[]> {
      const userUuid: string = this.$store.state.user.userUuid // this.$store.getters['user/getUserUuid']
      return new Promise(resolve => {
        getFavoritesFromServer({
          userUuid
        })
          .then((response: IFavoriresFromServerResponse) => {
            const favorites: IFavoriteDataExtended[] = response.favoritesList.map(
              (favoriteElement: IFavoriteData) => {
                const actionConverted: IActionAttributesData = convertAction(
                  favoriteElement.action
                )
                return {
                  ...favoriteElement,
                  uuid: favoriteElement.menuUuid,
                  name: favoriteElement.menuName,
                  description: favoriteElement.menuDescription,
                  action: actionConverted.name,
                  icon: actionConverted.icon
                }
              }
            )
            this.favorites = favorites
            resolve(favorites)
          })
          .catch(error => {
            console.warn(
                        `Error getting favorites: ${error.message}. Code: ${error.code}.`
            )
          })
      })
    }

    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === Namespaces.Dashboard + '/' + 'notifyDashboardRefresh') {
          this.getFavoritesList()
        }
      })
    }

    windowAction(row: any, param: string): void {
      const viewSearch = this.recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: row.referenceUuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })

      if (viewSearch) {
        this.$router.push(
          {
            name: viewSearch.name,
            query: {
              action: param,
              // tabParent: 0
              tabParent: (0).toString()
            }
          }, () => {})
      } else {
        this.$message({
          type: 'error',
          message: this.$t('notifications.noRoleAccess').toString()
        })
      }
    }

    // Hooks

    mounted() {
      this.getFavoritesList()

      this.unsubscribe = this.subscribeChanges()
    }

    beforeDestroy() {
      this.unsubscribe()
    }
}
