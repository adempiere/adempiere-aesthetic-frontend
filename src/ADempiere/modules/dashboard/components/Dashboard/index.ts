import { Component, Prop, Vue } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'Dashboard',
  mixins: [Template]
})
export default class Dashboard extends Vue {
    @Prop({ type: Object, required: true }) metadata: any
    // eslint-disable-next-line
    // @ts-ignore
    public dashboard?: any = this.metadata
    public unsupportedDashboards: string[] = ['activities', 'views', 'performance']
    // eslint-disable-next-line
    // @ts-ignore
    public activeDashboard?: any = this.metadata.isOpenByDefault ? this.metadata.dashboardName : undefined

    // Computed properties
    get renderDashboard() {
      // TODO: Add support to this list of currently unsupported dashboards
      if (this.unsupportedDashboards.includes(this.metadata.fileName)) {
        return
      }

      let dashboard
      switch (this.metadata.fileName) {
        case 'recentItems':
          dashboard = () => import('@/ADempiere/modules/dashboard/components/Dashboard/RecentItems')
          break
        case 'userfavorites':
          dashboard = () => import('@/ADempiere/modules/dashboard/components/Dashboard/UserFavorites')
          break
        case 'docstatus':
          dashboard = () => import('@/ADempiere/modules/dashboard/components/Dashboard/DocStatus')
          break
        default:
          dashboard = () => import('@/ADempiere/modules/dashboard/components/Dashboard/Calendar')
          break
      }
      return dashboard
      // return () => import(`@/components/ADempiere/Dashboard/${this.metadata.fileName}`)
    }
}
