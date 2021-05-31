
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { addClass, removeClass } from '@/utils'
import { Vue, Component, Prop, Watch, Ref } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'RightPanel',
  mixins: [Template]
})
export default class RightPanel extends Vue {
    @Prop({ default: false, type: Boolean }) private clickNotClose?: boolean
    @Prop({ default: 250, type: Number }) private buttonTop?: number
    @Ref() readonly rightMenu?: ChildNode
    public show = false

    // Computed properties
    get theme(): string {
      return this.$store.state.settings.theme
    }

    get isShowRightPanel(): boolean {
      return this.$store.state.contextMenuModule.isShowRightPanel
    }

    set isShowRightPanel(value: boolean) {
      this.$store.commit(Namespaces.ContextMenu + '/' + 'changeShowRigthPanel')
    }

    get icon(): 'el-icon-close' | 'el-icon-more' {
      if (this.isShowRightPanel) {
        return 'el-icon-close'
      }
      return 'el-icon-more'
    }

    // Methods
    addEventClick(): void {
      window.addEventListener('click', this.closeSidebar)
    }

    closeSidebar(evt: any): void {
      const parent = evt.target.closest('.rightMenu')
      if (!parent) {
        this.show = false
        window.removeEventListener('click', this.closeSidebar)
      }
    }

    closePanel() {
      this.$router.push({
        name: this.$route.name!,
        query: {
          ...this.$route.query,
          typeAction: ''
        }
      }, () => {})
      this.$store.commit(Namespaces.ContextMenu + '/' + 'changeShowRigthPanel', false)
      this.isShowRightPanel = !this.isShowRightPanel
    }

    insertToBody(): void {
      const elx: ChildNode = this.rightMenu!
      const body: HTMLBodyElement = document.querySelector('body')!
      body.insertBefore(elx, body.firstChild)
    }

    // Watchers
    @Watch('show')
    async handleShow(value: boolean) {
      if (value && !this.clickNotClose) {
        this.addEventClick()
      }
      if (value) {
        addClass(document.body, 'showRightMenu')
      } else {
        removeClass(document.body, 'showRightMenu')
      }
    }

    // Hooks
    beforeDestroy(): void {
      const elx = this.rightMenu
      elx?.remove()
    }
}
