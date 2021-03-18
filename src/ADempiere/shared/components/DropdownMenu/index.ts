import { DeviceType } from '@/ADempiere/modules/app/AppType'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { PanelContextType } from '../../utils/DictionaryUtils/ContextMenuType'
import { Namespaces } from '../../utils/types'
import Template from './template.vue'

@Component({
  name: 'DropdownMenu',
  mixins: [Template]
})
export default class DropdownMenu extends Vue {
    @Prop({ type: Object, default: {} }) items?: any
    @Prop({ type: String, default: '' }) title?: string
    public activeNames: string[] = ['1']

    // Computed properties
    get device(): DeviceType {
      return this.$store.state.app.device
    }

    get isMobile(): number {
      if (this.device === DeviceType.Mobile) {
        return 24
      }
      return 8
    }

    // Methods
    redirect(item: any) {
      this.openItemMenu(item)
      let tabParent = ''
      if (item.meta && item.meta.type === 'window') {
        tabParent = String(0)
      }

      this.$router.push(
        {
          name: item.name,
          query: {
            ...this.$route.query,
            // ...this.$router.query,
            tabParent
          },
          params: {
            ...this.$route.params,
            // ...this.$router.params,
            // childs: item.children?
            child: item.children
          }
        }
      )
    }

    /**
     * Clear field values, and set default values with open
     * @param view router item with meta attributes
     */
    openItemMenu(view: RouteConfig): void {
      if (view.meta && view.meta.uuid && view.meta.type) {
        const {
          parentUuid,
          uuid: containerUuid,
          type: panelType
        } = view.meta
        if (panelType !== PanelContextType.Window) {
          this.$store.dispatch(Namespaces.Panel + '/' + 'setDefaultValues', {
            parentUuid,
            containerUuid,
            panelType,
            isNewRecord: false
          })
          if (['browser'].includes(panelType)) {
            this.$store.dispatch(Namespaces.BusinessData + '/' + 'deleteRecordContainer', {
              viewUuid: containerUuid
            })
          }
        }
      }
    }
}
