import { IProductPriceData } from '@/ADempiere/modules/core'
import { IListProductPriceItemData } from '@/ADempiere/modules/pos/POSType'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { formatPrice, formatQuantity } from '@/ADempiere/shared/utils/valueFormat'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import MixinField from '../../../Field/Mixin/MixinField'
import ProductInfoList from './ProductList'
import Template from './template.vue'

@Component({
  name: 'FieldProductInfo',
  components: {
    ProductInfoList
  },
  mixins: [MixinField, Template]
})
export default class FieldProductInfo extends Mixins(MixinField) {
    @Prop({ type: String, default: 'isShowPopoverField' }) popoverName!: string
    public timeOut: any = null

    // Computed properties

    get isShowProductsPriceList(): boolean | undefined {
      const productPrice: IListProductPriceItemData = this.$store.state.listProductPriceModule.productPrice
      return productPrice.isShowPopoverField
    }

    set isShowProductsPriceList(isShowed: boolean | undefined) {
      if (this.$route.query.pos) {
        this.$store.commit(Namespaces.ProductPrice + '/' + 'showListProductPrice', {
          attribute: 'isShowPopoverField',
          isShowed
        })
      }
    }

    get listWithPrice(): IProductPriceData[] {
      const { list: productPricesList } = (this.$store.getters[Namespaces.PointOfSales + '/' + 'getProductPrice'] as IListProductPriceItemData)
      if (!isEmptyValue(productPricesList)) {
        return productPricesList!
      }
      return []
    }

    get keyShortcuts() {
      return {
        refreshList: ['f5'],
        refreshList2: ['shift', 'f5'],
        closeProductList: ['esc']
      }
    }

    // Methods
    formatPrice = formatPrice

    formatQuantity = formatQuantity

    shortcutKeyMethod(event: any) {
      switch (event.srcKey) {
        case 'refreshList':
        case 'refreshList2':
          this.$store.dispatch(Namespaces.ProductPrice + '/' + 'listProductPriceFromServer', {
            containerUuid: undefined,
            pageNumber: undefined,
            searchValue: undefined
          })
          break
        case 'closeProductList':
          this.$store.commit(Namespaces.ProductPrice + '/' + 'showListProductPrice', {
            attribute: this.popoverName,
            isShowed: false
          })
          break
      }
    }

    localSearch(stringToMatch: string, callBack: Function) {
      if (isEmptyValue(stringToMatch)) {
        // not show list
        callBack([])
        return
      }

      let results = this.listWithPrice
      if (!isEmptyValue(stringToMatch)) {
        const parsedValue = stringToMatch.toLowerCase().trim()

        results = results.filter(rowProduct => {
          const productAttributes = <IKeyValueObject>rowProduct.product

          for (const columnProductPrice in productAttributes) {
            const valueToCompare = String(productAttributes[columnProductPrice]).toLowerCase()

            if (valueToCompare.includes(parsedValue)) {
              return true
            }
          }
          return false
        })

        // Remote search
        if (isEmptyValue(results) && String(stringToMatch.length > 3)) {
          clearTimeout(this.timeOut)

          this.timeOut = setTimeout(() => {
            this.$store.dispatch(Namespaces.ProductPrice + '/' + 'listProductPriceFromServer', {
              containerUuid: 'Products-Price-List',
              pageNumber: 1,
              searchValue: stringToMatch
            })
              .then(() => {
                const recordsList = this.listWithPrice

                if (isEmptyValue(recordsList)) {
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
      const valueProduct = (!elementSelected.product)
        ? elementSelected.value
        : elementSelected.product.value
      this.$store.dispatch(Namespaces.Event + '/' + 'notifyActionKeyPerformed', {
        containerUuid: 'POS',
        columnName: 'ProductValue',
        // TODO: Verify with 'value' or 'searchValue' attribute
        value: valueProduct
      })
    }
}
