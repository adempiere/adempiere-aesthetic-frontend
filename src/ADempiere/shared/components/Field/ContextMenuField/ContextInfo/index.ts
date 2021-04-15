import { Namespaces } from '@/ADempiere/shared/utils/types'
import { recursiveTreeSearch } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import Template from './template.vue'

@Component({
  name: 'FieldContextInfo',
  mixins: [Template]
})
export default class FieldContextInfo extends Vue {
    @Prop({ type: Object, required: true }) fieldAttributes!: any
    @Prop({ type: [Number, String, Boolean, Array, Object, Date], default: undefined }) fieldValue?: [Number, String, Boolean, any[], Object, Date]
    // eslint-disable-next-line
    // @ts-ignore
    public value?: [Number, String, Boolean, any[], Object, Date] = this.fieldValue

    // Computed properties
    get permissionRoutes(): RouteConfig[] {
      return this.$store.getters.permission_routes
    }

    // Watcher
    @Watch('fieldValue')
    handleFieldValueChange(value: [Number, String, Boolean, any[], Object, Date]) {
      this.value = value
    }

    // Methods
    notSubmitForm(event: any) {
      event.preventDefault()
      return false
    }

    redirect(params: { window: any }): void {
      const { window } = params
      const viewSearch = recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: window.uuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })

      if (viewSearch) {
        this.$router.push({
          name: viewSearch.name,
          query: {
            action: 'advancedQuery',
            tabParent: String(0),
            [this.fieldAttributes.columnName]: String(this.value)
          }
        }, undefined)
      } else {
        this.$message({
          type: 'error',
          showClose: true,
          message: this.$t('notifications.noRoleAccess').toString()
        })
      }
      this.$store.commit(Namespaces.ContextMenu + '/' + 'changeShowRigthPanel', false)
    }
}
