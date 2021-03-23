import { getLocatorList } from '@/ADempiere/modules/field/FieldService/locator'
import { ILocatorData } from '@/ADempiere/modules/persistence'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Component, Mixins } from 'vue-property-decorator'
import MixinField from '../Mixin/MixinField'
import Template from './template.vue'

@Component({
  name: 'FieldLocator',
  mixins: [MixinField, Template]
})
export default class FieldLocator extends Mixins(MixinField) {
    public props: {lazy: boolean, lazyLoad: any} = {
      lazy: true,
      lazyLoad: this.searchLocatorByWarehouse
    }

    public level = 0
    public options: any[] = []

    // Computed properties
    get warehouse() {
      return this.$store.getters[Namespaces.User + '/' + 'getWarehouse']
    }

    get warehousesList() {
      return this.$store.getters[Namespaces.User + '/' + 'getWarehouses']
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
      getLocatorList({
        warehouseId: node.value
      })
        .then((locators: ILocatorData[]) => {
          const locatorList: {
            value: any
            label: string
            warehouse: number
            leaf: boolean
          }[] = []
          locators.map((locator: ILocatorData) => {
            locatorList.push({
              value: locator.id,
              label: locator.value,
              warehouse: locator.warehouseId,
              leaf: true
            })
          })

          // Resolve this
          resolve(locatorList)
        })
        .catch((error: any) => {
          console.warn(`Error getting Locator List By Warehouse from server. Code: ${error.code}. Message: ${error.message}.`)
          resolve()
        })
    }

    // Hooks
    async created() {
      this.options = this.warehousesList
    }
}
