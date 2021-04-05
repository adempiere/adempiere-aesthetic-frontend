import { Component, Vue } from 'vue-property-decorator'
import Template from './template.vue'
import MixinMainPanel from '../MixinMainPanel'
import Draggable from 'vuedraggable'
import FieldDefinition from '@/ADempiere/shared/components/Field'

@Component({
  name: 'MainPanelDesktop',
  mixins: [Template, MixinMainPanel],
  components: {
    FieldDefinition,
    Draggable
  }
})
export default class MainPanelDesktop extends Vue {
  // Methods
  setData(dataTransfer: any): void {
    // to avoid Firefox bug
    // Detail see : https://github.com/RubaXa/Sortable/issues/1012
    dataTransfer.setData('Text', '')
  }
}
