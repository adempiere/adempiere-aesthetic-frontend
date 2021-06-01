import { Component, Vue } from 'vue-property-decorator'
import DropdownMenu from '@/ADempiere/shared/components/DropdownMenu'
import Template from './template.vue'
import TitleAndHelp from '@/ADempiere/shared/components/TitleAndHelp'

@Component({
  name: 'Summary',
  mixins: [Template],
  components: {
    DropdownMenu,
    TitleAndHelp
  }
})
export default class Summary extends Vue {
    public routes = this.$store.state.permission.dynamicRoutes
    public parentUuid: string = this.$route.meta.parentUuid
    public optionList?:any
    // Computed properties
    get isIndex(): boolean {
      return this.$route.meta.isIndex
    }

    // Methods
    generateRoutesPool(): void {
      if (this.$route.meta && this.$route.meta.childs.length) {
        this.optionList = this.$route.meta.childs
      }
    }

    // Hooks
    beforeMount() {
      this.generateRoutesPool()
    }
}
