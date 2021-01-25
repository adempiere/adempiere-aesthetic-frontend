import { AppModule, DeviceType } from '@/store/modules/app'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { PanelContextType } from '../../utils/DictionaryUtils/ContextMenuType'
import MainPanelDesktop from './MainPanelDesktop'
import MainPanelMobile from './MainPanelMobile'
import Template from './template.vue'

@Component({
  name: 'MainPanel',
  mixins: [Template]
})
export default class MainPanel extends Vue {
    @Prop({ type: String, default: undefined }) parentUuid?: string
    @Prop({ type: String, required: true }) containerUuid!: string
    @Prop({ type: Object, default: {} }) metadata?: any
    @Prop({ type: String, default: 'window' }) panelType?: PanelContextType
    @Prop({ type: Boolean, default: false }) isAdvancedQuery?: boolean
    @Prop({ type: Boolean, default: false }) isShowedRecordNavigation?: boolean
    @Prop({
      type: Object,
      default: () => ({
        groupType: '',
        groupName: ''
      })
    }) groupTab?: {
      groupType: string
      groupName: string
    }

    // Computed properties
    get isMobile(): boolean {
      return AppModule.device === DeviceType.Mobile
    }

    get templateDevice() {
      if (this.isMobile) {
        return () => import('@/ADempiere/shared/components/Panel/MainPanelMobile')
      }
      return () => import('@/ADempiere/shared/components/Panel/MainPanelDesktop')
    }
}
