import { Component, Prop, Vue } from 'vue-property-decorator'
import { PanelContextType } from '../../utils/DictionaryUtils/ContextMenuType'
import { Namespaces } from '../../utils/types'
import { isEmptyValue } from '../../utils/valueUtils'
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
    @Prop({ type: Number, default: 50 }) pageSize?: number
    @Prop({ type: Number, default: undefined }) total?: number
    @Prop({ type: Function, default: undefined }) handleChangePage?: Function

    handleChangePageFunction(pageNumber: number): Function {
      if (this.handleChangePage && !isEmptyValue(this.handleChangePage)) {
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
