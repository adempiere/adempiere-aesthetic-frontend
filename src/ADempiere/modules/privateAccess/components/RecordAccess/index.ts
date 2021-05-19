import { DeviceType } from '@/ADempiere/modules/app/AppType'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'RecordAccess',
  mixins: [Template]
})
export default class RecordAccess extends Vue {
  @Prop({
    type: Object,
    default: () => {}
  }) record!: any

  @Prop({
    type: String,
    default: undefined
  }) tableName?: string

  get isMobile(): boolean {
    return this.$store.state.app.device === DeviceType.Mobile
  }

  get templateDevice() {
    if (this.isMobile) {
      return () => import('@/ADempiere/modules/privateAccess/components/RecordAccess/RecordAccessMobile')
    }
    return () => import('@/ADempiere/modules/privateAccess/components/RecordAccess/RecordAccessDesktop')
  }
}
