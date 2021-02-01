import { Component, Mixins, Vue } from 'vue-property-decorator'
import RightMenu from '@/ADempiere/modules/window/components/RightPanel/Menu'
import Template from './template.vue'
import MixinContextMenu from '../MixinContextMenu'

@Component({
  name: 'ContextMenuMobile',
  components: {
    RightMenu
  },
  mixins: [Template, MixinContextMenu]
})
export default class ContextMenuMobile extends Mixins(MixinContextMenu) {
  // Computed properties
  get isPanelTypeMobile(): boolean {
    if (['process', 'report'].includes(this.$route.meta.type)) {
      return true
    }
    return false
  }

  get iconDefault(): string {
    if (this.isPanelTypeMobile) {
      return 'component'
    }
    return 'skill'
  }
}
