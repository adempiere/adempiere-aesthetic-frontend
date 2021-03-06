import { IProductData, IProductPriceData } from '@/ADempiere/modules/core'
import { IListProductPriceItemData } from '@/ADempiere/modules/pos'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { formatPrice, formatQuantity } from '@/ADempiere/shared/utils/valueFormat'
import { Component, Mixins } from 'vue-property-decorator'
import MixinField from '../../Field/Mixin/MixinField'
import ProductInfoList from './ProductList'
import staticReportRoutes, { IZoomWindowReportRoute } from '@/ADempiere/shared/utils/Constants/zoomReport'
import Template from './template.vue'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'

@Component({
  name: 'ProductInfo',
  components: {
    ProductInfoList
  },
  mixins: [MixinField, Template]
})
export default class ProductInfo extends Mixins(MixinField) {
    public timeOut: any = null
    public process = staticReportRoutes

    // Computed
    get isShowProductsPriceList(): boolean | undefined {
      const itemData: IListProductPriceItemData = this.$store.state.listProductPriceModule.productPrice
      return itemData.isShowPopoverField
    }

    set isShowProductsPriceList(isShowed: boolean | undefined) {
      if (!isEmptyValue(this.$route.query.pos)) {
        this.$store.commit(Namespaces.ProductPrice + '/' + 'showListProductPrice', {
          attribute: 'isShowPopoverField',
          isShowed
        })
      }
    }

    get listWithPrice(): IProductPriceData[] {
      const productPrice: IListProductPriceItemData = this.$store.getters[Namespaces.PointOfSales + '/' + 'getProductPrice']
      const { list } = productPrice
      if (!isEmptyValue(list)) {
        return list!
      }
      return []
    }

    get currentPos() {
      return this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'].currentPointOfSales
    }

    get keyShortcuts() {
      return {
        refreshList: ['f5'],
        refreshList2: ['shift', 'f5']
      }
    }

    formatPrice = formatPrice

    formatQuantity = formatQuantity

    shortcutKeyMethod(event: any) {
      switch (event.srcKey) {
        case 'refreshList':
        case 'refreshList2':
          this.$store.dispatch(Namespaces.ProductPrice + '/' + 'listProductPriceFromServerProductInfo')
          break
      }
    }

    localSearch(stringToMatch: string, callBack: Function): void {
      if (!stringToMatch) {
        // not show list
        callBack([])
        return
      }
      let results: IProductPriceData[] = this.listWithPrice
      if (stringToMatch) {
        const parsedValue = stringToMatch.toLowerCase().trim()
        results = results.filter(rowProduct => {
          const productAttributes: IProductData = rowProduct.product
          const productAttributesObject: IKeyValueObject = {
            ...productAttributes
          }
          for (const columnProductPrice in productAttributes) {
            const valueToCompare: string = String(productAttributesObject[columnProductPrice]).toLowerCase()
            if (valueToCompare.includes(parsedValue)) {
              return true
            }
          }
          return false
        })
        // Remote search
        if (!results && String(stringToMatch.length > 3)) {
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            this.$store.dispatch(Namespaces.ProductPrice + '/' + 'listProductPriceFromServerProductInfo', {
              containerUuid: 'Products-Price-List-ProductInfo',
              pageNumber: 1,
              searchValue: stringToMatch
            })
              .then(() => {
                const recordsList: IProductPriceData[] = this.listWithPrice
                if (!recordsList || !recordsList.length) {
                  this.$message({
                    message: 'Sin resultados coincidentes con la busqueda',
                    type: 'info',
                    showClose: true
                  })
                }
                callBack(recordsList)
              })
          }, 2000)
          return
        }
      }
      // call callback function to return suggestions
      callBack(results)
    }

    handleSelect(elementSelected: any) {
      const valueProduct = elementSelected.product.value
      this.$store.dispatch(Namespaces.Event + '/' + 'notifyActionKeyPerformed', {
        containerUuid: 'POS',
        columnName: 'ProductValue',
        // TODO: Verify with 'value' or 'searchValue' attribute
        value: valueProduct
      })
    }

    findProcess(procces: (IZoomWindowReportRoute)[]) {
      // const proccesList = Object.keys(procces).map(key => {
      //   return [procces[key]]
      // })
      // if (this.isEmptyValue(this.currentPos)) {
      procces.forEach((report) => {
        this.$store.dispatch(Namespaces.ProcessDefinition + '/' + 'getProcessFromServer', { containerUuid: report.uuid })
      })
    }

    // Hooks
    // beforeMount() {
    //   this.$store.dispatch(Namespaces.PointOfSales + '/' + 'listPointOfSalesFromServer')
    // }

    async created() {
      this.$store.dispatch(Namespaces.PointOfSales + '/' + 'listPointOfSalesFromServer')
      this.findProcess(this.process)
    }
}
