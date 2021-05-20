import MixinProcessActivity from '@/ADempiere/modules/process/views/ProcessActivity/MixinProcessActivity'
import { Component, Mixins } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'ModeDesktop',
  mixins: [Template, MixinProcessActivity]
})
export default class ModeDesktop extends Mixins(MixinProcessActivity) { }
