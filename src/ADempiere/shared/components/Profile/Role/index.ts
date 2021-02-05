import { Namespaces } from '@/ADempiere/shared/utils/types'
import { getLocale } from '@/ADempiere/shared/lang'
import { Component, Vue, Watch } from 'vue-property-decorator'
import Template from './template.vue'
import { AppModule, DeviceType } from '@/store/modules/app'

@Component({
  name: 'ProfileRole',
  mixins: [Template]
})
export default class ProfileRole extends Vue {
    public valueRol = ''
    public options: any[] = []
    public currentLanguage?: string = getLocale()!

    // Computed properties
    get currentRole() {
      return this.$store.state.user.role
      // return this.$store.getters['user/getRole']
    }

    get rolesList() {
      return this.$store.state.rolesList
      // return this.$store.getters['user/getRoles']
    }

    get languagesList() {
      return this.$store.getters[Namespaces.System + '/' + 'getLanguagesList']
    }

    get isMobile() {
      return AppModule.device === DeviceType.Mobile
    }

    @Watch('currentRole.uuid')
    hanldeCurrentRoleUuidChange(uuidRol: string) {
      this.valueRol = uuidRol
    }

    // Hooks
    created() {
      this.valueRol = this.currentRole.uuid
      this.getLanguages()
    }

    // Methods
    public handleChange(valueSelected: string) {
      this.$message({
        message: this.$t('notifications.loading').toString(),
        showClose: true,
        iconClass: 'el-icon-loading'
      })
      this.$store.dispatch('user/changeRole', {
        roleUuid: valueSelected,
        isCloseAllViews: false
      })
    }

    public changeLanguage(languageValue: string) {
      this.currentLanguage = languageValue
    }

    public loadLanguageList(open: boolean) {
      if (open) {
        this.getLanguages()
      }
    }

    public async getLanguages() {
      if (!(this.languagesList)) {
        await this.$store.dispatch(Namespaces.System + '/' + 'getLanguagesFromServer')
      }
    }
}
