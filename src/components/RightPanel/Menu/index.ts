import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { addClass, removeClass } from '@/utils'
import { Namespaces } from '@/ADempiere/shared/utils/types'

@Component({
  name: 'RightPanel'
})
export default class Menu extends Vue {
    @Prop() clickNotClose = false
    @Prop() buttonTop = 16
    public show = false

    // Computed properties
    get theme(): string {
      return this.$store.state.settings.theme
    }

    get isShowRightPanel(): boolean {
      return this.$store.state.contextMenuModule.isShowRightPanel
    }

    set isShowRightPanel(change: boolean) {
      this.$store.commit(Namespaces.ContextMenu + '/' + 'changeShowRigthPanel')
    }

    get icon() {
      if (this.isShowRightPanel) {
        return 'el-icon-close'
      }
      return 'el-icon-more'
    }

    @Watch('show')
    handleShowChange(value: boolean) {
      if (value && !this.clickNotClose) {
        this.addEventClick()
      }
      if (value) {
        addClass(document.body, 'showrightMenu')
      } else {
        removeClass(document.body, 'showrightMenu')
      }
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

    insertToBody(): void {
      const elx: HTMLElement = this.$refs.rightMenu as HTMLElement
      const body: HTMLElement = document.querySelector('body')!
      body.insertBefore(elx, body.firstChild)
    }

    // Hooks
    mounted() {
      this.insertToBody()
    }

    beforeDestroy() {
      const elx = this.$refs.rightMenu as HTMLElement
      elx.remove()
    }
}
