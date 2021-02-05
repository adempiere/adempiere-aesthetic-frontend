import { AppModule, DeviceType } from '@/store/modules/app'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { icon } from '../icon'
import Template from './template.vue'

@Component({
  name: 'Item',
  mixins: [Template]
})
export default class Item extends Vue {
    @Prop({ required: true }) item: any

    // Computed properties
    get isMobile(): boolean {
      return AppModule.device === DeviceType.Mobile
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
