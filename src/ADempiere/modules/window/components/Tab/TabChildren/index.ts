import { IPanelDataExtended } from '@/ADempiere/modules/dictionary/DictionaryType/VuexType'
import { IRecordSelectionData } from '@/ADempiere/modules/persistence/PersistenceType'
import DataTable from '@/ADempiere/shared/components/DataTable'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import MixinTab from '../MixinTab'
import Template from './template.vue'

@Component({
  name: 'TabChildren',
  mixins: [Template, MixinTab],
  components: {
    DataTable
  }
})
export default class TabChildren extends Mixins(MixinTab) {
    @Prop({ type: String, default: undefined })
    firstTabUuid?: string = undefined

    public currentTabChild = this.$route.query.tabChild

    // Computed properties
    // data this current tab
    get getDataSelection(): IRecordSelectionData {
      return this.$store.getters[
        Namespaces.BusinessData + '/' + 'getDataRecordAndSelection'
      ](this.tabUuid)
    }

    // data parent tab
    get getterDataParentTab(): IRecordSelectionData {
      return this.$store.getters[
        Namespaces.BusinessData + '/' + 'getDataRecordAndSelection'
      ](this.firstTabUuid)
    }

    get isReadyFromGetData(): boolean {
      const { isLoaded, isLoadedContext } = this.getterDataParentTab
      return !this.getDataSelection.isLoaded && isLoaded && isLoadedContext
    }

    // load the child tabs only after loading the parent tab
    get isLoadedFieldsTabParent(): boolean {
      const panel: IPanelDataExtended | undefined = this.$store.getters[
        Namespaces.Panel + '/' + 'getPanel'
      ](this.firstTabUuid)
      if (panel) {
        return panel.isLoadFieldsList
      }
      return false
    }

    // Watchers
    @Watch('$route.query.tabChild')
    handleRouteQueryTabChildChange(actionValue: any) {
      if (!actionValue) {
        this.currentTabChild = '0'
        return
      }
      this.currentTabChild = actionValue
    }

    // Current TabChildren
    @Watch('currentTabChild')
    handleCurrentTabChildChange(newValue: any, oldValue: any) {
      if (newValue !== oldValue) {
        this.$router.push(
          {
            query: {
              ...this.$route.query,
              tabChild: String(newValue)
            },
            params: {
              ...this.$route.params
            }
          },
          undefined
        )
      }
    }

    // Refrest the records of the TabChildren
    @Watch('isReadyFromGetData')
    handleIsReadyFromGetDataChange(value: boolean) {
      if (value) {
        this.getDataTable()
      }
    }

    // Methods
    setCurrentTabChild(): void {
      let activeTab = this.$route.query.tabChild
      if (activeTab === undefined) {
        activeTab = String(0)
      }
      this.currentTabChild = activeTab
    }

    // Hooks
    created() {
      this.setCurrentTabChild()
      const currentIndex = parseInt(this.currentTabChild.toString(), 10)
      this.tabUuid = this.tabsList[currentIndex].uuid
    }

    mounted() {
      if (this.isReadyFromGetData) {
        this.getDataTable()
      }
    }
}
