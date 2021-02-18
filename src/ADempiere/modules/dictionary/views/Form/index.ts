import ContextMenu from '@/ADempiere/modules/window/components/ContextMenu'
import FormPanel from '@/ADempiere/shared/components/Form'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { SettingsModule } from '@/store/modules/settings'
import { Component, Vue } from 'vue-property-decorator'
import { IFormDataExtended } from '../../DictionaryType'
import Template from './template.vue'
import ModalDialog from '@/ADempiere/shared/components/Dialog'

@Component({
  name: 'FormView',
  mixins: [Template],
  components: {
    ContextMenu,
    FormPanel,
    ModalDialog
  }
})
export default class FormView extends Vue {
    public formUuid: string = this.$route.meta.uuid
    public formMetadata: Partial<IFormDataExtended> = {}
    public isLoaded = false
    public panelType: PanelContextType = PanelContextType.Form

    // Computed properties
    get formTitle(): string {
      if (this.$route.meta.title === 'PriceChecking') {
        return this.$t('route.PriceChecking').toString()
      } else if (this.$route.meta.title === 'ProductInfo') {
        return this.$t('route.ProductInfo').toString()
      }
      return this.formMetadata.name || this.$route.meta.title
    }

    get fromFileName() {
      return this.formMetadata.fileName || this.$route.meta.title
    }

    get getterForm(): IFormDataExtended | undefined {
      return this.$store.getters[Namespaces.FormDefinition + '/' + 'getForm'](this.formUuid)
    }

    get showContextMenu(): boolean | undefined {
      return SettingsModule.showContextMenu // this.$store.state.settings.showContextMenu
    }

    set showContextMenu(value: boolean | undefined) {
      SettingsModule.ChangeSetting({
        key: 'showContextMenu',
        value: value
      })
    }

    get showNavar() {
      return SettingsModule.showNavar
    }

    get isShowTitleForm(): boolean {
      return this.$store.getters[Namespaces.FormDefinition + '/' + 'getIsShowTitleForm']
    }

    // Methods
    changeDisplatedTitle(): void {
      this.$store.commit(Namespaces.FormDefinition + '/' + 'changeShowTitleForm', !this.isShowTitleForm)
    }

    getForm(): void {
      const panel: IFormDataExtended | undefined = this.getterForm
      if (panel) {
        this.formMetadata = panel
        this.isLoaded = true
      } else {
        this.$store.dispatch(Namespaces.Panel + '/' + 'getPanelAndFields', {
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
