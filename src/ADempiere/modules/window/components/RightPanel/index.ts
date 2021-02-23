
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
    @Ref() readonly rightPanel?: ChildNode
    public show = false

    // Computed properties
    get theme(): string {
      return this.$store.state.settings.theme
    }

    addEventClick(): void {
      window.addEventListener('click', this.closeSidebar)
    }

    closeSidebar(evt: any): void {
      const parent = evt.target.closest('.rightPanel')
      if (!parent) {
        this.show = false
        window.removeEventListener('click', this.closeSidebar)
      }
    }

    insertToBody(): void {
      const elx: ChildNode = this.rightPanel!
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
        addClass(document.body, 'showRightPanel')
      } else {
        removeClass(document.body, 'showRightPanel')
      }
    }

    // Hooks
    mounted(): void {
      this.insertToBody()
    }

    beforeDestroy(): void {
      const elx = this.rightPanel
      elx?.remove()
    }
}
