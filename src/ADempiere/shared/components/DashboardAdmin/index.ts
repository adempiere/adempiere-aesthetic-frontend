import { IDashboardDataExtended } from '@/ADempiere/modules/dashboard'
import Dashboard from '@/ADempiere/modules/dashboard/components/Dashboard'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Namespaces } from '../../utils/types'
import Template from './template.vue'

@Component({
  name: 'DashboardAdmin',
  mixins: [Template],
  components: {
    Dashboard
  }
})
export default class DashboardAdmin extends Vue {
    public roleUuid: string | undefined = this.$store.getters.getRoleUuid
    public dashboardList: IDashboardDataExtended[] = []

    // Computed properties
    get getterDashboard(): IDashboardDataExtended {
      return this.$store.getters[
        Namespaces.Dashboard + '/' + 'getDashboardByRole'
      ](this.roleUuid)
    }

    get currentRole() {
      return this.$store.state.user.role
    }

    get getterRol(): string | undefined {
      return this.$store.getters.getRoleUuid
    }

    // Watchers
    @Watch('getterRol')
    handleGetterRol(value?: string) {
      this.getDashboardListFromServer()
    }

    // Methods
    private getDashboardListFromServer(): void {
      this.$store
        .dispatch(Namespaces.Dashboard + '/' + 'listDashboard', {
          roleId: this.currentRole.id,
          roleUuid: this.currentRole.uuid
        })
        .then((response: IDashboardDataExtended[]) => {
          this.dashboardList = response
          this.$forceUpdate()
        })
        .catch(error => {
          console.warn(error)
        })
    }

    // Hooks
    mounted() {
      this.getDashboardListFromServer()
    }
}
