import { DeviceType, IAppState } from '@/ADempiere/modules/app/AppType'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'VPOS',
  mixins: [Template]
})
export default class VPOS extends Vue {
  @Prop({ type: Object, required: true }) metadata!: any

  get isMobile() {
    return (this.$store.state.app as IAppState).device === DeviceType.Mobile
  }

  get templateDevice() {
    if (this.isMobile) {
      return () =>
        import('@/ADempiere/shared/components/Form/VPOS/TemplateDevice/Mobile')
    }
    return () =>
      import('@/ADempiere/shared/components/Form/VPOS/TemplateDevice/Desktop')
  }
}
