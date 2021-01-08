import { Component, Mixins } from 'vue-property-decorator'
import MixinMainPanel from '../MixinMainPanel'

@Component({
  name: 'MainPanelMobile',
  mixins: [MixinMainPanel]
})
export default class MainPanelMobile extends Mixins(MixinMainPanel) {

}
