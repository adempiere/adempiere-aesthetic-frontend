import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'MixinRelations'
})
export default class MixinRelations extends Vue {
    @Prop({ default: undefined, type: String }) protected menuParentUuid?: string

    get relationsList(): any[] {
      let menuUuid: string = this.$route.params.menuParentUuid
      if (!menuUuid) {
        menuUuid = this.menuParentUuid!
      }
      const relations: any = this.$store.getters[Namespaces.ContextMenu + '/' + 'getRelations'](menuUuid)

      if (relations) {
        if (relations.children) {
          return relations.children
        }
        if (relations.meta && relations.meta.childs.length) {
          return relations.meta.childs
        }
      }
      return []
    }

    get isEmptyChilds(): boolean {
      const childs = this.relationsList
      const len = childs.length
      if (len < 1) {
        return true
      }
      if (len === 1) {
        // diferent to current view
        return childs[0].meta.uuid === this.$route.meta.uuid
      }
      return false
    }

    // Methods
    getChilds(item: any): any[] {
      if (item.children.length) {
        return item.children
      }
      if (item.meta && item.meta.childs.length) {
        return item.meta.childs
      }
      return []
    }
}
