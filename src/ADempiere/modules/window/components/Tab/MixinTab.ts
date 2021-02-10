import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { ElTabs } from 'element-ui/types/tabs'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'MixinTab'
})
export default class MixinTab extends Vue {
    @Prop({ type: String, default: '' }) windowUuid!: string
    // eslint-disable-next-line
    @Prop({ type: Object, default: () => {} }) windowMetadata: any
    @Prop({ type: Array, default: () => [] }) tabsList!: any[]
    public tabUuid = ''
    public panelType: PanelContextType = PanelContextType.Window

    // Computed properties
    get isCreateNew(): boolean {
      return Boolean(this.$route.query.action === 'create-new')
    }

    // Methods
    getDataTable(): void {
      this.$store
        .dispatch('getDataListTab', {
          parentUuid: this.windowUuid,
          containerUuid: this.tabUuid
        })
        .catch(error => {
          console.warn(
                    `Error getting data list tab. Message: ${error.message}, code ${error.code}.`
          )
        })
    }

    /**
     * @param {object} tabHTML DOM HTML the tab clicked
     */
    handleClick(tabHTML: ElTabs) {
      if (this.tabUuid !== tabHTML.$attrs.tabuuid) {
        this.tabUuid = tabHTML.$attrs.tabuuid
      }
    }

    // Hooks
    created() {
      this.tabUuid = this.tabsList[0].uuid
    }
}
