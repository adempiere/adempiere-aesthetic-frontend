import { Component, Vue } from 'vue-property-decorator'
import MixinContextMenu from '../MixinContextMenu'
import Template from './template.vue'

@Component({
  name: 'ContextMenuDesktop',
  mixins: [MixinContextMenu, Template]
})
export default class ContextMenuDesktop extends Vue {
    private none: any = 'remove it'
}
