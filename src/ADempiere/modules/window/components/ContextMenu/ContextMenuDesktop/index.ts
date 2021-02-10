import { Component, Mixins, Vue } from 'vue-property-decorator'
import MixinContextMenu from '../MixinContextMenu'
import Template from './template.vue'

@Component({
  name: 'ContextMenuDesktop',
  mixins: [MixinContextMenu, Template]
})
export default class ContextMenuDesktop extends Mixins(MixinContextMenu) {
    private none: any = 'remove it'
}
