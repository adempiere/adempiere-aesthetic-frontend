import ContextMenu from '@/ADempiere/modules/window/components/ContextMenu'
import FormPanel from '@/ADempiere/shared/components/Form'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { SettingsModule } from '@/store/modules/settings'
import { Component, Vue } from 'vue-property-decorator'
import { IFormDataExtended } from '../../DictionaryType'
import Template from './template.vue'

@Component({
  name: 'FormView',
  mixins: [Template],
  components: {
    ContextMenu,
    FormPanel
  }
})
export default class FormView extends Vue {
    public formUuid: string = this.$route.meta.uuid
    public formMetadata: Partial<IFormDataExtended> = {}
    public isLoaded = false
    public panelType: PanelContextType = PanelContextType.Form

    // Computed properties
    get formTitle(): string {
      return this.formMetadata.name || this.$route.meta.title
    }

    get getterForm(): IFormDataExtended | undefined {
      return this.$store.getters[Namespaces.FormDefinition + '/' + 'getForm'](this.formUuid)
    }

    get showContextMenu(): boolean | undefined {
      return SettingsModule.showContextMenu // this.$store.state.settings.showContextMenu
    }

    set showContextMenu(value: boolean | undefined) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'showContextMenu',
        value: value
      })
    }

    get isShowTitleForm(): boolean {
      return this.$store.getters[Namespaces.FormDefinition + '/' + 'getIsShowTitleForm']
    }

    // Methods
    changeDisplatedTitle(): void {
      this.$store.commit('changeShowTitleForm', !this.isShowTitleForm)
    }

    getForm(): void {
      const panel: IFormDataExtended | undefined = this.getterForm
      if (panel) {
        this.formMetadata = panel
        this.isLoaded = true
      } else {
        this.$store.dispatch('getPanelAndFields', {
          containerUuid: this.formUuid,
          panelType: this.panelType,
          routeToDelete: this.$route
        })
          .then(responseForm => {
            this.formMetadata = responseForm
          })
          .finally(() => {
            this.isLoaded = true
          })
      }
    }

    // Hooks
    created() {
      this.getForm()
    }
}