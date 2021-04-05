import { DeviceType } from '@/ADempiere/modules/app/AppType'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { icon } from '../icon'
import Template from './template.vue'

@Component({
  name: 'ItemContextMenu',
  mixins: [Template]
})
export default class Item extends Vue {
    @Prop({ required: true }) item: any

    // Computed properties
    get isMobile(): boolean {
      return this.$store.state.app.device === DeviceType.Mobile
    }

    // methods

    getChilds(item: any): any[] {
      if (item.meta.childs) {
        return item.children
      }

      if (item.meta && (item.meta.childs)) {
        return item.meta.childs
      }
      return []
    }

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
      })
    }
}
