import { Mixins, Component } from 'vue-property-decorator'
import MixinChatEntries from '../MixinChatEntries'
import Template from './template.vue'

@Component({
  name: 'ChatEntriesModeDesktop',
  mixins: [Template, MixinChatEntries]
})
export default class ChatEntriesModeDesktop extends Mixins(MixinChatEntries) {}
