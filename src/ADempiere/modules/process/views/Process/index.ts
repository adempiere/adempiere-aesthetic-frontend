import Template from './template.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import MainPanel from '@/ADempiere/shared/components/Panel'
import ContextMenu from '../../../window/components/ContextMenu'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { IPanelDataExtended } from '../../../dictionary'
import TitleAndHelp from '@/ADempiere/shared/components/TitleAndHelp'

@Component({
  name: 'ProcessView',
  mixins: [Template],
  components: {
    MainPanel,
    ContextMenu,
    TitleAndHelp
  }
})
export default class ProcessView extends Vue {
    @Prop({ type: Boolean, default: false }) isEdit = false
    public processMetadata: Partial<IPanelDataExtended> = {}
    public processUuid: string = this.$route.meta.uuid
    public isLoadedMetadata = false
    public panelType: PanelContextType = PanelContextType.Process

    // Computed Properties
    get showContextMenu(): boolean | undefined {
      return this.$store.state.settings.showContextMenu
    }

    get getterProcess(): IPanelDataExtended | undefined {
      return this.$store.getters[Namespaces.Panel + '/' + 'getPanel'](this.processUuid)
    }

    // Methods
    getProcess(): void {
      const process: IPanelDataExtended | undefined = this.getterProcess
      if (process) {
        this.processMetadata = process
        this.isLoadedMetadata = true
      } else {
        this.$store.dispatch(Namespaces.Panel + '/' + 'getPanelAndFields', {
          containerUuid: this.processUuid,
          panelType: this.panelType,
          routeToDelete: this.$route
        }).then(processResponse => {
          this.processMetadata = processResponse
        }).finally(() => {
          this.isLoadedMetadata = true
        })
      }
    }

    // Hooks
    created() {
      this.getProcess()
      this.$store.dispatch(Namespaces.Settings + '/' + 'ChangeSetting', {
        key: 'showContextMenu',
        value: true
      })
    }
}
