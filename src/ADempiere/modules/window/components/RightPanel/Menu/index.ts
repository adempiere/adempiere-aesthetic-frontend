import { addClass, removeClass } from '@/utils'
import { Vue, Component, Prop, Watch, Ref } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'Menu',
  mixins: [Template]
})
export default class Menu extends Vue {
    @Prop({ default: false, type: Boolean }) private clickNotClose?: boolean
    @Prop({ default: 16, type: Number }) private buttonTop?: number
    @Ref() readonly rightMenu?: ChildNode
    public show = false

    // Computed Properties
    get theme(): string {
      return this.$store.state.settings.theme
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
        addClass(document.body, 'showrightMenu')
      } else {
        removeClass(document.body, 'showrightMenu')
      }
    }

    // Hooks
    mounted(): void {
      this.insertToBody()
    }

    beforeDestroy(): void {
      const elx = this.rightMenu
      elx?.remove()
    }
}
