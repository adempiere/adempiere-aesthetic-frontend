import { Component, Vue } from 'vue-property-decorator'
import RightMenu from '@/ADempiere/modules/window/components/RightPanel/Menu'
import Template from './template.vue'

@Component({
  name: 'ContextMenuMobile',
  components: {
    RightMenu
  },
  mixins: [Template]
})
export default class ContextMenuMobile extends Vue {
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
