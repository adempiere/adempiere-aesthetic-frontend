import { Component, Prop, Vue } from 'vue-property-decorator'
import RecentItems from './RecentItems'
import UserFavorites from './UserFavorites'
import DocStatus from './DocStatus'
import Calendar from './Calendar'

@Component({
  name: 'Dashboard'
})
export default class Dashboard extends Vue {
    @Prop({ type: Object, required: true }) metadata: any = undefined
    public dashboard?: any = this.metadata
    public unsupportedDashboards: string[] = ['activities', 'views', 'performance']
    public activeDashboard?: any = this.metadata.isOpenByDefault ? this.metadata.dashboardName : undefined

    // Computed properties
    get renderDashboard() {
      // TODO: Add support to this list of currently unsupported dashboards
      if (this.unsupportedDashboards.includes(this.metadata.fileName)) {
        return
      }

      let dashboard: () => RecentItems | UserFavorites | DocStatus | Calendar
      switch (this.metadata.fileName) {
        case 'recentItems':
          dashboard = () => new RecentItems()
          break
        case 'userfavorites':
          dashboard = () => new UserFavorites()
          break
        case 'docstatus':
          dashboard = () => new DocStatus()
          break
        default:
          dashboard = () => new Calendar()
          break
      }
      return dashboard
      // return () => import(`@/components/ADempiere/Dashboard/${this.metadata.fileName}`)
    }
}
