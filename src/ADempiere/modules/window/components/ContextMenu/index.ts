import { Component, Prop, Vue } from 'vue-property-decorator'
import ContextMenuMobile from '@/ADempiere/modules/window/components/ContextMenu/ContextMenuMobile'
import ContextMenuDesktop from '@/ADempiere/modules/window/components/ContextMenu/ContextMenuDesktop'
import Template from './template.vue'

@Component({
  name: 'ContextMenu',
  mixins: [Template]
})
export default class ContextMenu extends Vue {
    @Prop({ type: String, default: undefined }) public menuParentUuid?: string
    @Prop({ type: String, default: undefined }) public parentUuid?: string
    @Prop({ type: String, required: true }) public containerUuid?: string
    @Prop({ type: String, default: undefined }) public panelType?: string
    @Prop({ type: String, default: undefined }) public tableName?: string
    @Prop({ type: Boolean, default: false }) public isReport = false
    @Prop({ type: String, default: undefined }) public lastParameter?: string
    @Prop({ type: String, default: undefined }) public reportFormat?: string
    @Prop({ type: Boolean, default: undefined }) public isInsertRecord?: boolean

    // Computed properties
    get isMobile(): boolean {
      return this.$store.state.app.device === 'mobile'
    }

    get templateDevice() {
      if (this.isMobile) {
        return new ContextMenuMobile() // () => ContextMenuMobile
      }
      return new ContextMenuDesktop() // () => ContextMenuDesktop
    }
}
