import { Component, Vue, Watch, Prop, Ref } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'IconElement',
  mixins: [Template]
})
export default class IconElement extends Vue {
    @Ref() readonly headerSearchSelect?: HTMLElement
    @Prop({ type: String, required: true }) icon!: string
    private isShowElement = false
    private options?: any[]
    private show = true

    // Methods
    click() {
      this.isShowElement = !this.isShowElement
      if (this.isShowElement) {
        this.headerSearchSelect && this.headerSearchSelect.focus()
      }
    }

    close() {
      this.headerSearchSelect && this.headerSearchSelect.blur()
      this.options = []
      this.show = false
    }

    // Watchers
    @Watch('isShowElement')
    handleIsShowElement(value: boolean) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
}
