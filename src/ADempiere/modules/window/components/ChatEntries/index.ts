import { Component, Prop, Vue } from 'vue-property-decorator'
import Template from './template.vue'
import InputChat from './InputChat'
import { IChatEntryData } from '../../WindowType/DomainType'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { DeviceType, IAppState } from '@/ADempiere/modules/app/AppType'

@Component({
  name: 'ChatEntries',
  components: {
    InputChat
  },
  mixins: [Template]
})
export default class ChatEntries extends Vue {
  @Prop({ default: undefined }) private tableName?: string
  @Prop({ default: undefined }) private recordId?: number
  @Prop({
    type: Boolean,
    default: false
  }) rightPanel?: boolean

  // Computed properties

  get isMobile(): boolean {
    return (this.$store.state.app as IAppState).device === DeviceType.Mobile
  }

  get templateDevice() {
    if (this.isMobile) {
      return () => import('@/ADempiere/modules/window/components/ChatEntries/ModeMobile')
    }
    return () => import('@/ADempiere/modules/window/components/ChatEntries/ModeDesktop')
  }
}
