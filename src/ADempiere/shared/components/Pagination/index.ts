import { Component, Prop, Vue } from 'vue-property-decorator'
import { PanelContextType } from '../../utils/DictionaryUtils/ContextMenuType'
import Template from './template.vue'

@Component({
  name: 'CustomPagination',
  mixins: [Template]
})
export default class CustomPagination extends Vue {
    @Prop({ type: String, default: undefined }) parentUuid?: string = undefined
    @Prop({ type: String, default: undefined })
    containerUuid?: string = undefined

    @Prop({ type: String, default: 'window' }) panelType: PanelContextType =
        PanelContextType.Window

    @Prop({ type: Number, default: undefined }) currentPage?: number = undefined
    @Prop({ type: Number, default: undefined }) selection?: number = undefined
    @Prop({ type: Number, default: undefined }) pageSize?: number = 50
    @Prop({ type: Number, default: undefined }) total?: number = undefined
    @Prop({ type: Function }) handleChangePage: Function = (
      pageNumber: number
    ) => {
      this.$store.dispatch('setPageNumber', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        pageNumber,
        panelType: this.panelType
      })
    }

    // Computed properties
    get isSelection(): boolean {
      if (!this.selection) {
        return false
      }
      return true
    }
}
