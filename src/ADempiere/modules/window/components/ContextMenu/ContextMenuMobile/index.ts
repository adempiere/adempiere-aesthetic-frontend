import { Component, Mixins, Vue } from 'vue-property-decorator'
import Template from './template.vue'
import MixinContextMenu from '../MixinContextMenu'
import { IContextActionData } from '../../../WindowType'
import VueI18n from 'vue-i18n'
import { ActionContextName, ActionContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'

@Component({
  name: 'ContextMenuMobile',
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

  get isUndoAction(): boolean {
    if (this.isWindow) {
      if (!this.isWithRecord) {
        return true
      }
    }
    return false
  }

  get typeOfAction(): 'warning' | 'default' {
    if (this.isUndoAction) {
      return 'warning'
    }
    return 'default'
  }

  get isPlain(): boolean {
    if (this.isUndoAction) {
      return true
    }
    return false
  }

  get defaultActionToRun(): IContextActionData {
    if (this.isUndoAction) {
      return this.actions[2]
    }
    return this.actions[0]
  }

  get defaultActionName(): VueI18n.TranslateResult {
    if (this.isWindow) {
      if (this.isWithRecord) {
        return this.$t('window.newRecord')
      }
      return this.$t('data.undo')
    }
    return this.$t('components.RunProcess')
  }

  get iconDefault(): string {
    if (this.isPanelTypeMobile) {
      return 'component'
    }
    return 'skill'
  }

  // Methods
  clickRelation(item: any) {
    this.$router.push({
      name: item.name,
      query: {
        tabParent: (0).toString()
      }
    })
  }

  clickRunAction(action: any) {
    if (action === 'refreshData') {
      this.refreshData()
    } else {
      this.runAction(action)
    }
  }

  clickReferences(reference: any) {
    this.openReference(reference)
  }

  iconAction(action: IContextActionData): string | undefined {
    let icon: string | undefined
    if (action.type === ActionContextType.DataAction) {
      switch (action.action) {
        case ActionContextName.SetDefaultValues:
          icon = 'el-icon-news'
          break
        case ActionContextName.DeleteEntity:
          icon = 'el-icon-delete'
          break
        case ActionContextName.UndoModifyData:
          icon = 'el-icon-refresh-left'
          break
        case ActionContextName.LockRecord:
          icon = 'el-icon-lock'
          break
        case ActionContextName.UnlockRecord:
          icon = 'el-icon-unlock'
          break
        case ActionContextName.RecordAccess:
          icon = 'el-icon-c-scale-to-original'
          break
      }
    } else if (action.type === ActionContextType.Process) {
      icon = 'el-icon-setting'
    } else {
      icon = 'el-icon-setting'
    }
    return icon
  }

  styleLabelAction(value: any) {
    if (value) {
      return 'font-size: 14px;margin-top: 0% !important;margin-left: 0px;margin-bottom: 10%;display: contents;'
    } else {
      return 'font-size: 14px;margin-top: 1.5% !important;margin-left: 2%;margin-bottom: 5%;display: contents;'
    }
  }
}
