import { Component, Vue } from 'vue-property-decorator'
import Dropdown from '@/ADempiere/shared/components/Dropdown'
import Template from './template.vue'
import { RouteConfig } from 'vue-router'

@Component({
  name: 'Summary',
  mixins: [Template],
  components: {
    Dropdown
  }
})
export default class Summary extends Vue {
    public routes = this.$store.state.permission.addRoutes
    public parentUuid: string = this.$route.meta.parentUuid
    public optionList?:any
    // Computed properties
    get isIndex(): boolean {
      return this.$route.meta.isIndex
    }

    // Methods
    generateRoutesPool(): void {
      if (this.$route.meta && this.$route.meta.childs.length) {
        // this.optionList = this.$route.meta.childs
        this.optionList = this.$route.meta.childs
        console.log('optionsList: ')
        console.log(this.optionList[0])
      }
    }

    // Hooks
    beforeMount() {
      this.generateRoutesPool()
    }
}
