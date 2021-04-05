import { Component, Prop, Vue } from 'vue-property-decorator'
import { PanelContextType } from '../../utils/DictionaryUtils/ContextMenuType'
import { Namespaces } from '../../utils/types'
import Template from './template.vue'

@Component({
  name: 'CustomPagination',
  mixins: [Template]
})
export default class CustomPagination extends Vue {
    @Prop({ type: String, default: undefined }) parentUuid?: string
    @Prop({ type: String, default: undefined }) containerUuid?: string

    @Prop({ type: String, default: 'window' }) panelType!: PanelContextType

    @Prop({ type: Number, default: undefined }) currentPage?: number
    @Prop({ type: Number, default: undefined }) selection?: number
    @Prop({ type: Number, default: undefined }) pageSize?: number
    @Prop({ type: Number, default: undefined }) total?: number
    @Prop({ type: Function }) handleChangePage?: Function

    handleChangePageFunction(pageNumber: number) {
      if (this.handleChangePage) {
        return this.handleChangePage(pageNumber)
      } else {
        return (pageNumber: number) => {
          this.$store.dispatch(Namespaces.BusinessData + '/' + 'setPageNumber', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            pageNumber,
            panelType: this.panelType
          })
        }
      }
    }

    // Computed properties
    get isSelection(): boolean {
      if (!this.selection) {
        return false
      }
      return true
    }
}
