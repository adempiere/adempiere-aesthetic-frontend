import { Component, Vue, Watch } from 'vue-property-decorator'
import store from '@/ADempiere/shared/store'
import { DeviceType } from '@/ADempiere/modules/app/AppType'
import { Namespaces } from '@/ADempiere/shared/utils/types'

const WIDTH = 992 // refer to Bootstrap's responsive design

@Component({
  name: 'ResizeMixin'
})
export default class extends Vue {
  get device() {
    return this.$store.state.app.device
  }

  get sidebar() {
    return this.$store.state.app.sidebar
  }

  @Watch('$route')
  private onRouteChange() {
    if (this.device === DeviceType.Mobile && this.sidebar.opened) {
      store.dispatch(Namespaces.App + '/' + 'CloseSideBar', false)
    }
  }

  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  }

  mounted() {
    const isMobile = this.isMobile()
    if (isMobile) {
      store.dispatch(Namespaces.App + '/' + 'ToggleDevice', DeviceType.Mobile)
      store.dispatch(Namespaces.App + '/' + 'CloseSideBar', true)
    }
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  }

  private isMobile() {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  private resizeHandler() {
    if (!document.hidden) {
      const isMobile = this.isMobile()
      store.dispatch(Namespaces.App + '/' + 'ToggleDevice', isMobile ? DeviceType.Mobile : DeviceType.Desktop)
      if (isMobile) {
        store.dispatch(Namespaces.App + '/' + 'CloseSideBar', true)
      }
    }
  }
}
