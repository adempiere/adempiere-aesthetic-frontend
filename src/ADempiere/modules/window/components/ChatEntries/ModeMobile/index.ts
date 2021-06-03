import { Prop, Component, Mixins } from 'vue-property-decorator'
import MixinChatEntries from '../MixinChatEntries'
import Template from './template.vue'

@Component({
  name: 'ChatEntriesModeMobile',
  mixins: [Template, MixinChatEntries]
})
export default class ChatEntriesModeMobile extends Mixins(MixinChatEntries) {
  @Prop({
    type: Boolean,
    default: false
  }) rightPanel!: boolean
}
