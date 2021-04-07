import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import MixinForm from '../../../MixinForm'
import Template from './template.vue'
import CustomPagination from '@/ADempiere/shared/components/Pagination'
import fieldListProductPrice from '../fieldList'
import { IFieldLocation } from '@/ADempiere/shared/components/Field/FieldLocation/fieldList'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import {
  IListProductPriceItemData,
  IPointOfSalesData
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

    get currentPoint(): IPointOfSalesData | undefined {
      return this.$store.getters[
        Namespaces.PointOfSales + '/' + 'getCurrentPOS'
      ]
    }

    get productPrice(): IListProductPriceItemData {
      const productPrice = this.$store.getters[
        Namespaces.ListProductPrice + '/' + 'getProductPrice'
      ]
      console.log('productPrice')
      console.log(productPrice)
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

    // Watchers
    @Watch('isReadyFromGetData')
    hanldeIsReadyFromGetDataChange(isToLoad: boolean) {
      console.log('isReadyFromGetData change')
      console.log(isToLoad)
      if (isToLoad) {
        this.loadProductsPricesList()
      }
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
          this.$store.commit(Namespaces.ListProductPrice + '/' + 'showListProductPrice', {
            attribute: this.popoverName,
            isShowed: false
          })
          break
      }
    }

    loadProductsPricesList(): void {
      this.$store.dispatch(Namespaces.ListProductPrice + '/' + 'listProductPriceFromServer', {
        containerUuid: undefined,
        pageNumber: undefined,
        searchValue: undefined
      })
    }

    /**
     * @param {number} newPage
     */
    handleChangePage(newPage: number): void {
      this.$store.dispatch(Namespaces.ListProductPrice + '/' + 'setProductPicePageNumber', newPage)
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
      this.$store.commit(Namespaces.ListProductPrice + '/' + 'showListProductPrice', {
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
            this.$store.commit(Namespaces.ListProductPrice + '/' + 'setIsReloadProductPrice')
          }, 1000)
        }
      })
    }

    // Hooks
    created() {
      this.unsubscribe = this.subscribeChanges()

      if (this.isReadyFromGetData) {
        this.loadProductsPricesList()
      }
      if (isEmptyValue(this.listWithPrice)) {
        this.$store.dispatch(Namespaces.ListProductPrice + '/' + 'listProductPriceFromServer', {
          containerUuid: 'Products-Price-List',
          pageNumber: 1,
          searchValue: ''
        })
      }
    }

    beforeDestroy() {
      this.unsubscribe()
    }
}
