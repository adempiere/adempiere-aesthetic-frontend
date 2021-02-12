import { IProductPriceData } from '@/ADempiere/modules/core'
import { IListProductPriceItemData, IPointOfSalesData } from '@/ADempiere/modules/pos'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { formatPrice } from '@/ADempiere/shared/utils/valueFormat'
import { Table } from 'element-ui'
import { Component, Mixins, Prop, Ref, Watch } from 'vue-property-decorator'
import CustomPagination from '../../../Pagination'
import MixinForm from '../../MixinForm'
import fieldsListProductPrice from '../fieldsList'

@Component({
  name: 'ProductList',
  components: { CustomPagination },
  mixins: [MixinForm]
})
export default class ProductList extends Mixins(MixinForm) {
  @Ref() readonly singleTable!: Table
  @Prop({ type: Boolean, default: true }) isSelectable!: boolean
  @Prop({ type: String, default: 'isShowPopoverField' }) popoverName!: string
  @Prop({
    type: Object,
    default: () => {
      return {
        uuid: 'Products-Price-List-ProductInfo',
        containerUuid: 'Products-Price-List-ProductInfo'
      }
    }
  }) metadata!: { uuid: string, containerUuid: string }

  // Data
  public defaultMaxPagination = 50
  public resource: any = {}
  public fieldsList = fieldsListProductPrice
  public isCustomForm = true
  public timeOut: any = null
  private currentRow: any
  public attribute = ''

  // Computed properties
  get defaultImage() {
    return require('@/image/ADempiere/pos/no-image.jpg')
  }

  get isShowProductsPriceList(): any {
    const productPrice: IListProductPriceItemData = this.$store.state[Namespaces.ListProductPrice + '/' + 'productPrice']
    const productPriceObj: IKeyValueObject = {
      ...productPrice
    }
    return productPriceObj[this.attribute]
  }

  get currentPoint(): IPointOfSalesData | undefined {
    return this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS']
  }

  get productPrice(): IListProductPriceItemData {
    return this.$store.getters[Namespaces.ListProductPrice + '/' + 'getProductPrice']
  }

  get listWithPrice(): IProductPriceData[] {
    const { list } = this.productPrice
    if (list && list.length) {
      return list
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
  handleIsReadyFromGetData(isToLoad: boolean) {
    this.loadProductsPricesList()
  }

  // Hooks
  created() {
    this.unsubscribe = this.subscribeChanges()
    if (this.isReadyFromGetData) {
      this.loadProductsPricesList()
    }
  }

  beforeDestroy() {
    this.unsubscribe()
  }

  // Methods
  formatPrice = formatPrice

  srcImage(keyValue: string) {
    if (!keyValue) {
      return this.defaultImage
    }
    // const image = this.valuesImage.find(item => item.identifier === fileName).value
    const image = this.resource[keyValue]
    if (!image) {
      return this.defaultImage
    }
    return image
  }

  setCurrent(row: any) {
    this.singleTable.setCurrentRow(row)
  }

  handleCurrentChange(val: any) {
    this.currentRow = val
    this.setCurrent(this.currentRow)
  }

  keyAction(event: any) {
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

  loadProductsPricesList() {
    this.$store.dispatch(Namespaces.ListProductPrice + '/' + 'listProductPriceFromServerProductInfo', {})
  }

  /**
     * @param {number} newPage
     */
  handleChangePage(newPage: number) {
    this.$store.dispatch(Namespaces.ListProductPrice + '/' + 'setProductPicePageNumber', newPage)
  }

  findlistProductWithRow(row: any) {
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
    // close popover of list product price
    this.$store.commit(Namespaces.ListProductPrice + '/' + 'showListProductPrice', {
      attribute: this.popoverName,
      isShowed: false
    })
  }

  getTaxAmount(basePrice: number, taxRate: number): number {
    if (!basePrice || !taxRate) {
      return 0
    }
    return (basePrice * taxRate) / 100
  }

  subscribeChanges() {
    return this.$store.subscribe((mutation, state) => {
      // if (!this.isEmptyValue(this.listWithPrice)) {
      //   this.setCurrent(this.listWithPrice[0])
      // }
      if (mutation.type === 'updateValueOfField' &&
          !mutation.payload.columnName.includes('DisplayColumn') &&
          mutation.payload.containerUuid === this.metadata.containerUuid) {
        clearTimeout(this.timeOut)
        this.timeOut = setTimeout(() => {
          this.$store.dispatch(Namespaces.ListProductPrice + '/' + 'updateSearch', mutation.payload.value)
          this.$store.commit(Namespaces.ListProductPrice + '/' + 'setIsReloadProductPrice')
        }, 1000)
      }
    })
  }
}
