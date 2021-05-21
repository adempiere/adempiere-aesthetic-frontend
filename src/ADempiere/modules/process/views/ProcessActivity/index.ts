import { DeviceType, IAppState } from '@/ADempiere/modules/app/AppType'
import { Component, Vue } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'ProcessActivity',
  mixins: [Template]
})
export default class ProcessActivity extends Vue {
  get isMobile() {
    return (this.$store.state.app as IAppState).device === DeviceType.Mobile
  }

  get templateDevice(): any {
    if (this.isMobile) {
      console.warn('Mobile')
      return () =>
        import('@/ADempiere/modules/process/views/ProcessActivity/ModeMobile')
    }
    console.warn('Desktop')
    return () =>
      import('@/ADempiere/modules/process/views/ProcessActivity/ModeDesktop')
  }
}
