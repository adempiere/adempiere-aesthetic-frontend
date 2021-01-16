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
    @Prop({ type: String, default: undefined }) parentUuid?: string = undefined
    @Prop({ type: String, required: true }) containerUuid!: string
    @Prop({ type: Object, default: {} }) metadata: any = {}
    @Prop({ type: String, default: 'window' }) panelType : PanelContextType = PanelContextType.Window
    @Prop({ type: Boolean, default: false }) isAdvancedQuery = false
    @Prop({ type: Boolean, default: false }) isShowedRecordNavigation = false
    @Prop({
      type: Object,
      default: () => ({
        groupType: '',
        groupName: ''
      })
    }) groupTab = {
      groupType: '',
      groupName: ''
    }

    // Computed properties
    get isMobile(): boolean {
      return this.$store.state.app.device === 'mobile'
    }

    get templateDevice() {
      if (this.isMobile) {
        return () => new MainPanelMobile() // import('@/components/ADempiere/Panel/mainPanelMobile')
      }
      return () => new MainPanelDesktop() // import('@/components/ADempiere/Panel/mainPanelDesktop')
    }
}
