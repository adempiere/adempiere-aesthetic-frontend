import { Component, Vue } from 'vue-property-decorator'
import MixinMainPanel from '../MixinMainPanel'
import Template from './template.vue'

@Component({
  name: 'MainPanelMobile',
  mixins: [MixinMainPanel, Template]
})
export default class MainPanelMobile extends Vue {

}
