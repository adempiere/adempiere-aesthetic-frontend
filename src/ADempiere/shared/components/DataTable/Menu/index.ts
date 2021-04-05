import { Component, Mixins } from 'vue-property-decorator'
import MixinMenuTable from './MixinMenuTable'
import Template from './template.vue'

@Component({
  name: 'TableMainMenu',
  mixins: [MixinMenuTable, Template]
})
export default class TableMainMenu extends Mixins(MixinMenuTable) {
    public menuType = 'tableMainMenu'
}
