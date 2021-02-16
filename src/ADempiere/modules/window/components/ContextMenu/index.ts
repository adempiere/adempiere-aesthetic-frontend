import { Component, Prop, Vue } from 'vue-property-decorator'
import Template from './template.vue'
import { AppModule, DeviceType } from '@/store/modules/app'

@Component({
  name: 'ContextMenu',
  mixins: [Template]
})
export default class ContextMenu extends Vue {
    @Prop({ type: String, default: undefined }) public menuParentUuid?: string
    @Prop({ type: String, default: undefined }) public parentUuid?: string
    @Prop({ type: String, default: undefined }) public containerUuid?: string
    @Prop({ type: String, default: undefined }) public panelType?: string
    @Prop({ type: String, default: undefined }) public tableName?: string
    @Prop({ type: Boolean, default: false }) public isReport!: boolean
    @Prop({ type: String, default: undefined }) public lastParameter?: string
    @Prop({ type: String, default: undefined }) public reportFormat?: string
    @Prop({ type: Boolean, default: undefined }) public isInsertRecord?: boolean

    // Computed properties
    get isMobile(): boolean {
      return AppModule.device === DeviceType.Mobile
    }

    get templateDevice() {
      if (this.isMobile) {
        return () => import('@/ADempiere/modules/window/components/ContextMenu/ContextMenuMobile')
      }
      return () => import('@/ADempiere/modules/window/components/ContextMenu/ContextMenuDesktop') // () => ContextMenuDesktop
    }
}
