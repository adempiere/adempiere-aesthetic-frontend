import { Component, Prop, Vue } from 'vue-property-decorator'
import RolesNavbar from '@/ADempiere/shared/components/Profile/RolesNavbar'
import { getImagePath } from '@/ADempiere/shared/utils/resource'
import Template from './template.vue'

@Component({
  name: 'ProfilePreview',
  mixins: [Template],
  components: {
    RolesNavbar
  }
})
export default class ProfilePreview extends Vue {
    @Prop({ type: String, default: '' }) avatar = ''
    @Prop({
      type: Object,
      default: {
        name: '',
        email: '',
        roles: ''
      }
    }) user?: {
        name: string
        email: string
        roles: string
    }

    // Computed properties
    get currentRole() {
      return this.$store.state.user.role
    }

    get avatarResize(): string {
      const defaultAvatar =
            'https://avatars1.githubusercontent.com/u/1263359?s=200&v=4?imageView2/1/w/40/h/40'
      if (!this.avatar || defaultAvatar.includes(this.avatar)) {
        return defaultAvatar
      }

      const { uri } = getImagePath({
        file: this.avatar,
        width: 40,
        height: 40
      })

      return uri
    }
}
