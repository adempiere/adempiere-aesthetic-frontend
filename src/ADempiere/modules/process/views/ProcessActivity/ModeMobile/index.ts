import MixinProcessActivity from '@/ADempiere/modules/process/views/ProcessActivity/MixinProcessActivity'
import { Component, Mixins } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'ModeMobile',
  mixins: [Template, MixinProcessActivity]
})
export default class ModeMobile extends Mixins(MixinProcessActivity) { }
