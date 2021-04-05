import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Mixins } from 'vue-property-decorator'
import MixinMenuTable from '../MixinMenuTable'
import Template from './template.vue'

@Component({
  name: 'TableContextMenu',
  mixins: [MixinMenuTable, Template]
})
export default class TableContextMenu extends Mixins(MixinMenuTable) {
    public menuType = 'tableContextMenu'

    // Methods
    deleteRecord() {
      this.$store.dispatch(Namespaces.Window + '/' + 'deleteEntity', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        row: this.currentRow
      })
    }
}
