import { DeviceType } from '@/ADempiere/modules/app/AppType'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Vue, Component } from 'vue-property-decorator'
import { IEntityLogData } from '../../../WindowType'
import MixinInfo from '../mixinInfo'
import Template from './template.vue'

@Component({
  name: 'RecordLogs',
  mixins: [
    Template,
    MixinInfo
  ]
})
export default class RecordLogs extends Vue {
    private currentKey = 0
    private typeAction = 0

    // Computed Properties
    get isMobile(): boolean {
      return this.$store.state.app.device === DeviceType.Mobile
    }

    get classIsMobileScroll(): string {
      if (this.isMobile) {
        return 'scroll-window-log-change-mobile'
      }
      return 'scroll-window-log-change'
    }

    get classIsMobilePanel() {
      if (this.isMobile) {
        return 'panel-mobile'
      }
      return 'panel'
    }

    get gettersListRecordLogs(): IEntityLogData[] {
      return this.$store.getters[Namespaces.ContainerInfo + '/' + 'getRecordLogs'].entityLogs
    }

    get getIsChangeLog(): boolean {
      if (!this.gettersListRecordLogs) {
        return false
      }
      return true
    }

    // Methods
    showKey(key: number, index: number) {
      if (key === this.currentKey && index === this.typeAction) {
        this.currentKey = 1000
      } else {
        this.currentKey = key
        this.typeAction = index
      }
    }
}
