import { Vue, Component, Prop } from 'vue-property-decorator'
import { icon } from '../icon'

@Component({
  name: 'Item'
})
export default class Item extends Vue {
    @Prop({ required: true }) item: any

    // Computed properties
    get isMobile(): boolean {
      return this.$store.state.app.device === 'mobile'
    }

    // methods

    classIconMenuRight(iconMenu: any) {
      iconMenu = icon.find((element) => {
        return element.type === this.item.meta.type
      })
      return iconMenu.icon
    }

    handleClick(item: any) {
      this.$router.push({
        name: item.name,
        query: {
          tabParent: ''
        }
      }, undefined)
    }
}
