import { Component, Vue } from 'vue-property-decorator'
import MixinMainPanel from '../MixinMainPanel'
import Template from './template.vue'
import FieldDefinition from '@/ADempiere/shared/components/Field'

@Component({
  name: 'MainPanelMobile',
  components: {
    FieldDefinition
  },
  mixins: [MixinMainPanel, Template]
})
export default class MainPanelMobile extends Vue {

}
