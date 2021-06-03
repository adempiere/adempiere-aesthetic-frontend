import { DeviceType } from '@/ADempiere/modules/app/AppType'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { PanelContextType } from '../../utils/DictionaryUtils/ContextMenuType'
import { Namespaces } from '../../utils/types'
import Template from './template.vue'
import MenuCard from './MenuCard'

@Component({
  name: 'DropdownMenu',
  mixins: [Template],
  components: {
    MenuCard
  }
})
export default class DropdownMenu extends Vue {
    @Prop({ type: Object, default: {} }) items?: any
    @Prop({ type: String, default: '' }) title?: string
    public activeNames: string[] = ['1']

    // Computed properties
    get device(): DeviceType {
      return this.$store.state.app.device
    }

    get isMobile(): number {
      if (this.device === DeviceType.Mobile) {
        return 24
      }
      return 8
    }
}
