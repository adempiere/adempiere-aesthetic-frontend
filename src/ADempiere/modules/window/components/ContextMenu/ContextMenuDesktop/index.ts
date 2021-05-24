import { Namespaces } from '@/ADempiere/shared/utils/types'
import VueI18n from 'vue-i18n'
import { Component, Mixins } from 'vue-property-decorator'
import { IContextActionData } from '../../../WindowType'
import MixinContextMenu from '../MixinContextMenu'
import Template from './template.vue'

@Component({
  name: 'ContextMenuDesktop',
  mixins: [MixinContextMenu, Template]
})
export default class ContextMenuDesktop extends Mixins(MixinContextMenu) {
  private openedsMenu: string[] = ['actions']
  // Computed properties
  get isPanelTypeMobile() {
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

  get iconDefault(): 'component' | 'skill' {
    if (this.isPanelTypeMobile) {
      return 'component'
    }
    return 'skill'
  }

  // Methods
  clickRelation(item: { name: string | undefined }) {
    this.$router.push({
      name: item.name,
      query: {
        tabParent: (0).toString()
      }
    }, () => {})
  }

  clickRunAction(action: string | IContextActionData) {
    if (action === 'refreshData') {
      this.refreshData()
    } else if (action === 'shareLink') {
      this.setShareLink()
    } else if (typeof action !== 'string' && action.action === 'recordAccess') {
      this.$store.commit(Namespaces.ContextMenu + '/' + 'changeShowRigthPanel', true)
      this.$store.commit(Namespaces.ContextMenu + '/' + 'setRecordAccess', true)
      this.$store.commit(Namespaces.ContextMenu + '/' + 'attributeEmbedded', action)
      this.$router.push({
        name: this.$route.name!,
        query: {
          ...this.$route.query,
          typeAction: (this.$store.getters[Namespaces.ContextMenu + '/' + 'getAttributeEmbedded'] as Partial<IContextActionData>).action
        }
      }, () => {})
      this.runAction(action)
    } else {
      if (typeof action !== 'string') {
        this.runAction(action)
      }
    }
  }

  clickReferences(reference: any) {
    this.openReference(reference)
  }

  iconAction(action: IContextActionData) {
    let icon
    if (action.type === 'dataAction') {
      switch (action.action) {
        case 'setDefaultValues':
          icon = 'el-icon-news'
          break
        case 'deleteEntity':
          icon = 'el-icon-delete'
          break
        case 'undoModifyData':
          icon = 'el-icon-refresh-left'
          break
        case 'lockRecord':
          icon = 'el-icon-lock'
          break
        case 'unlockRecord':
          icon = 'el-icon-unlock'
          break
        case 'recordAccess':
          icon = 'el-icon-c-scale-to-original'
          break
      }
    } else if (action.type === 'process') {
      icon = 'el-icon-setting'
    } else {
      icon = 'el-icon-setting'
    }
    return icon
  }

  styleLabelAction(value: any): string {
    if (value) {
      return 'font-size: 14px;margin-top: 0% !important;margin-left: 0px;margin-bottom: 10%;display: contents;'
    } else {
      return 'font-size: 14px;margin-top: 1.5% !important;margin-left: 2%;margin-bottom: 5%;display: contents;'
    }
  }

  handleCommand(childs: IContextActionData) {
    this.runAction(childs)
  }

  // Hooks
  created() {
    this.generateContextMenu()
    this.getReferences()
  }
}
