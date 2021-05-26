import { DeviceType } from '@/ADempiere/modules/app/AppType'
import {
  IEntityLogData,
  IEntityLogDataExtended
} from '@/ADempiere/modules/window'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import MixinContextMenuField from '../MixinContextMenuField'
import Template from './template.vue'

@Component({
  name: 'FieldChangeLogs',
  mixins: [Template]
})
export default class FieldChangeLogs extends Mixins(MixinContextMenuField) {
  @Prop({
    type: Object,
    required: true
  })
  fieldAttributes!: any

  @Prop({
    type: String,
    default: undefined
  })
  recordUuid?: string

  // Data
  private isLoading = false
  private currentKey = 0
  private typeAction = 0

  // Computed properties
  get language(): string {
    return this.$store.getters.language as string
  }

  get listLogsField(): IEntityLogDataExtended[] {
    const log: IEntityLogData[] = this.$store.getters[
      Namespaces.ContainerInfo + '/' + 'getRecordLogs'
    ].entityLogs as IEntityLogData[]
    if (log) {
      const logsField = log.map(element => {
        let type
        if (
          !isEmptyValue(element.changeLogsList[0].newDisplayValue) &&
          isEmptyValue(element.changeLogsList[0].oldDisplayValue)
        ) {
          type = 'success'
        } else if (
          isEmptyValue(element.changeLogsList[0].newDisplayValue) &&
          !isEmptyValue(element.changeLogsList[0].oldDisplayValue)
        ) {
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
      return logsField.filter(
        field => field.columnName === this.fieldAttributes.columnName
      )
    }
    return []
  }

  get isMobile(): boolean {
    return (this.$store.state.app.device as DeviceType) === DeviceType.Mobile
  }

  get classIsMobilePanel(): string {
    if (this.isMobile) {
      return 'panel-mobile'
    }
    return 'scroll-child'
  }

  //  Methods
  sortSequence(
    itemA: IEntityLogDataExtended,
    itemB: IEntityLogDataExtended
  ): number {
    return (
      new Date().setTime(new Date(itemB.logDate).getTime()) -
      new Date().setTime(new Date(itemA.logDate).getTime())
    )
  }

  translateDate(value: string | number | Date): string {
    return this.$d(new Date(value), 'long', this.language)
  }

  showkey(key: number, index: number) {
    if (key === this.currentKey && index === this.typeAction) {
      this.currentKey = 1000
    } else {
      this.currentKey = key
      this.typeAction = index
    }
  }
}
