import { Component, Mixins, Prop } from 'vue-property-decorator'
import MixinForm from '../../../MixinForm'
import Template from './template.vue'
import CustomPagination from '@/ADempiere/shared/components/Pagination'
import fieldListProductPrice from '../fieldList'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import {
  ICurrentPointOfSalesData,
  IListProductPriceItemData,
  IPOSAttributesData
} from '@/ADempiere/modules/pos'
import { IProductPriceData } from '@/ADempiere/modules/core/CoreType'
import { formatPrice } from '@/ADempiere/shared/utils/valueFormat'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'

@Component({
  name: 'ProductList',
  components: {
    CustomPagination
  },
  mixins: [MixinForm, Template]
})
export default class ProductList extends Mixins(MixinForm) {
    @Prop({
      type: Object,
      default: () => {
        return {
          uuid: 'Products-Price-List',
          containerUuid: 'Products-Price-List'
        }
      }
    }) metadata: any

    @Prop({ type: Boolean, default: true }) isSelectable!: boolean
    @Prop({ type: String, default: 'isShowPopoverField' }) popoverName!: String

    public defaultMaxPagination = 50
    // public fieldsList: IFieldLocation[] = fieldListProductPrice
    fieldsList = fieldListProductPrice
    public isCustomForm = true
    public timeOut: any = null
    public attribute = ''

    // Computed properties
    get isShowProductsPriceList() {
      return this.$store.state.listProductPriceModule.productPrice[
        this.attribute
      ]
    }

    get currentPointOfSales(): ICurrentPointOfSalesData | undefined {
      return (this.$store.getters[
        Namespaces.PointOfSales + '/' + 'posAttributes'
      ] as IPOSAttributesData).currentPointOfSales
    }

    get productPrice(): IListProductPriceItemData {
      const productPrice = this.$store.getters[
        Namespaces.PointOfSales + '/' + 'getProductPrice'
      ]
      return productPrice
    }

    get listWithPrice(): IProductPriceData[] {
      const { list: productPricesList } = this.productPrice
      if (productPricesList && !isEmptyValue(productPricesList)) {
        return productPricesList
      }
      return []
    }

    get shortsKey() {
      return {
        closeProductList: ['esc'],
        refreshList: ['f5']
      }
    }

    get isReadyFromGetData(): boolean {
      const { isLoaded, isReload } = this.productPrice
      return (!isLoaded || isReload) // && this.isShowProductsPriceList
    }

    // Methods
    formatPrice = formatPrice

    keyAction(event: any) {
      console.log('keyAction')
      switch (event.srcKey) {
        case 'refreshList':
          /**
                 * TODO: When refreshing you are making 2 list requests, you can be the
                 * observer that activates the second request
                 */
          this.loadProductsPricesList()
          break

        case 'closeProductList':
          this.$store.commit(Namespaces.ProductPrice + '/' + 'showListProductPrice', {
            attribute: this.popoverName,
            isShowed: false
          })
          break
      }
    }

    loadProductsPricesList(): void {
      this.$store.dispatch(Namespaces.ProductPrice + '/' + 'listProductPriceFromServer', {
        containerUuid: undefined,
        pageNumber: undefined,
        searchValue: undefined
      })
    }

    /**
     * @param {number} newPage
     */
    handleChangePage(newPage: number): void {
      this.$store.dispatch(Namespaces.ProductPrice + '/' + 'setProductPicePageNumber', newPage)
    }

    findlistProductWithRow(row: IProductPriceData): void {
      console.log('hiciste click en row: ')
      console.log(row)
      console.log(this.isSelectable)
      if (!this.isSelectable) {
        return
      }
      // TODO: Change this dispatch for set values with local methods, to delete subscripton
      this.$store.dispatch(Namespaces.Event + '/' + 'notifyActionKeyPerformed', {
        containerUuid: 'POS',
        columnName: 'ProductValue',
        // TODO: Verify with 'value' or 'searchValue' attribute
        value: row.product.name
      })
      console.log('popoverName')
      console.log(this.popoverName)

      // close popover of list product price
      this.$store.commit(Namespaces.ProductPrice + '/' + 'showListProductPrice', {
        attribute: this.popoverName,
        isShowed: false
      })
    }

    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (
          mutation.type === Namespaces.FieldValue + '/' + 'updateValueOfField' &&
                !mutation.payload.columnName.includes('DisplayColumn') &&
                mutation.payload.containerUuid === this.metadata.containerUuid
        ) {
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            this.$store.commit(Namespaces.ProductPrice + '/' + 'setIsReloadProductPrice')
          }, 1000)
        }
      })
    }

    /**
     * @param {object} PointOfSales
     */
    validatePos(PointOfSales: ICurrentPointOfSalesData | undefined): void {
      console.log(isEmptyValue(PointOfSales), this.isReadyFromGetData)
      if (isEmptyValue(PointOfSales)) {
        const message: string = this.$t('notifications.errorPointOfSale').toString()
        this.$store.commit(Namespaces.ProductPrice + '/' + 'setListProductPrice', {
          isLoaded: true,
          productPricesList: []
        })
        this.$message({
          type: 'info',
          message,
          duration: 1500,
          showClose: true
        })
      }
    }

    // Hooks
    created() {
      this.unsubscribe = this.subscribeChanges()
      this.$store.commit(Namespaces.ProductPrice + '/' + 'setListProductPrice', {
        isLoaded: true
      })
      this.timeOut = setTimeout(() => {
        this.validatePos(this.currentPointOfSales)
      }, 3000)
    }

    beforeDestroy() {
      this.unsubscribe()
    }
}
