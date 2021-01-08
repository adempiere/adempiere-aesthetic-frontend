import { requestLocatorList } from '@/ADempiere/modules/field/FieldService/locator'
import { IEntityData, IEntityListData } from '@/ADempiere/modules/persistence'
import { IWorkflowNodeData } from '@/ADempiere/modules/window'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import Template from './template.vue'

@Component({
  name: 'FieldLocator',
  mixins: [MixinField, Template]
})
export default class FieldLocator extends Mixins(MixinField) {
    @Prop() lazy = true
    @Prop() lazyLoad = this.searchLocatorByWarehouse
    public options: any[] = []

    // Computed properties
    get warehouse() {
      return this.$store.getters['user/getWarehouse']
    }

    get warehousesList() {
      return this.$store.getters['user/getWarehouses']
        .map((itemWarehouse: any) => {
          return {
            label: itemWarehouse.name,
            value: itemWarehouse.id,
            children: []
          }
        })
    }

    // Methods
    preHandleChange(value: any) {
      let selected = value
      if (Array.isArray(value)) {
        selected = value[value.length - 1]
      }
      this.handleFieldChange({
        value: selected
      })
      this.value = value
    }

    searchLocatorByWarehouse(node: any, resolve: Function) {
      requestLocatorList({
        warehouseId: node.value
      })
        .then((responseData: IEntityListData) => {
          const locatorList = responseData.recordsList.map((item: IEntityData) => {
            const { attributes: values } = item
            return {
              label: values[0].value,
              value: values[0].value, // M_Locator_ID,
              warehouse: values[0].valueTo, // M_Warehouse_ID, // node.value
              leaf: true
            }
          })
          resolve(locatorList)
        })
        .catch(error => {
          console.warn(`Error getting Locator List By Warehouse from server. Code: ${error.code}. Message: ${error.message}.`)
          resolve()
        })
    }

    // Hooks
    async created() {
      this.options = this.warehousesList
    }
}
