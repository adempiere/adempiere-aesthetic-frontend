import { ILanguageData, IOrganizationData } from '@/ADempiere/modules/core'
import { IRoleData } from '@/ADempiere/modules/user'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { AppModule, DeviceType } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import { Component, Vue } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'RolesNavbar',
  mixins: [Template]
})
export default class RolesNavbar extends Vue {
  public getLanguageList: ILanguageData[] | undefined = this.$store.getters[Namespaces.System + '/' + 'getLanguagesList']
  // Computed properties
  get currentRoleUuid(): string {
    return UserModule.role.uuid!
  }

  set currentRoleUuid(roleToSet: string) {
    this.changeRole(roleToSet)
  }

  get rolesList(): IRoleData[] {
    return this.$store.state.user.rolesList
  }

  get currentOrganizationUuid(): string {
    const organization: Partial<IOrganizationData> = UserModule.organization
    if (organization) {
      return organization.uuid!
    }
    return ''
  }

  set currentOrganizationUuid(organizationToSet: string) {
    this.changeOrganization(organizationToSet)
  }

  get organizationsList(): IOrganizationData[] {
    return UserModule.organizationsList
  }

  get currentWarehouseUuid(): string {
    const warehouse: any = UserModule.warehouse
    if (warehouse) {
      return warehouse.uuid
    }
    return ''
  }

  set currentWarehouseUuid(warehouseToSet: string) {
    this.changeWarehouse(warehouseToSet)
  }

  get warehousesList(): any[] {
    return UserModule.warehousesList
  }

  get isFiltrable(): boolean {
    return AppModule.device !== DeviceType.Mobile
  }

  // Hooks
  created() {
    this.getLanguages()
  }

  // Methods
  changeRole(roleUuid: string) {
    this.$message({
      message: this.$t('notifications.loading').toString(),
      iconClass: 'el-icon-loading'
    })
    UserModule.ChangeRole({
      roleUuid,
      organizationUuid: this.currentOrganizationUuid,
      warehouseUuid: this.currentWarehouseUuid
    }).then((response) => {
      if (response) {
        if (this.$route.name !== 'Dashboard') {
          this.$router.push({
            path: '/'
          })
        }
        this.$store.dispatch(Namespaces.Dashboard + '/' + 'listDashboard', {
          roleId: response.id,
          roleUuid: response.uuid
        })
      }
    })
  }

  changeOrganization(organizationUuid: string) {
    const currentOrganization = this.organizationsList.find((element: IOrganizationData) => element.uuid === organizationUuid)
    if (currentOrganization) {
      this.$router.push({
        path: '/'
      })
      UserModule.ChangeOrganization({
        organizationUuid,
        organizationId: currentOrganization.id,
        route: this.$router.currentRoute
      })
    }
  }

  showOrganizationsList(isShow: boolean): void {
    if (isShow && !(this.organizationsList)) {
      // this.$store.dispatch('user/getOrganizationsListFromServer', this.currentRoleUuid)
      UserModule.GetOrganizationsListFromServer(this.currentRoleUuid)
    }
  }

  changeWarehouse(warehouseUuid: string): void {
    UserModule.ChangeWarehouse({
      warehouseUuid
    })
  }

  showWarehouseList(isShow: boolean) {
    if (isShow && !(this.warehousesList)) {
      UserModule.GetWarehousesList(this.currentOrganizationUuid)
    }
  }

  getLanguages() {
    if (!(this.getLanguageList)) {
      this.$store.dispatch(Namespaces.System + '/' + 'getLanguagesFromServer')
    }
  }
}
