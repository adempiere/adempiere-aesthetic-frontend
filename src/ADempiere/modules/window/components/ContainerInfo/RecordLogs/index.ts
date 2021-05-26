import { DeviceType } from '@/ADempiere/modules/app/AppType'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { Vue, Component } from 'vue-property-decorator'
import { IEntityLogData, IEntityLogDataExtended } from '../../../WindowType'
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

    get gettersListRecordLogs(): IEntityLogDataExtended[] {
      const log: IEntityLogData[] = (this.$store.getters[Namespaces.ContainerInfo + '/' + 'getRecordLogs'].entityLogs as IEntityLogData[])
      if (log) {
        return log.map((element: IEntityLogData) => {
          let type: string
          if (!isEmptyValue(element.changeLogsList[0].newDisplayValue) && isEmptyValue(element.changeLogsList[0].oldDisplayValue)) {
            type = 'success'
          } else if (isEmptyValue(element.changeLogsList[0].newDisplayValue) && !isEmptyValue(element.changeLogsList[0].oldDisplayValue)) {
            type = 'danger'
          } else {
            type = 'primary'
          }
          return {
            ...element,
            columnName: element.changeLogsList[0].columnName,
            type
          }
        })
      }
      return []
    }

    get getIsChangeLog(): boolean {
      if (!this.gettersListRecordLogs) {
        return false
      }
      return true
    }

    // Methods
    sortSequence(itemA: IEntityLogDataExtended, itemB: IEntityLogDataExtended): number {
      return new Date().setTime(new Date(itemB.logDate).getTime()) - new Date().setTime(new Date(itemA.logDate).getTime())
    }

    showKey(key: number, index: number) {
      if (key === this.currentKey && index === this.typeAction) {
        this.currentKey = 1000
      } else {
        this.currentKey = key
        this.typeAction = index
      }
    }
}
