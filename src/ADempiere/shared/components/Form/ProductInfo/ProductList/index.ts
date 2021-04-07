import { IProductPriceData } from '@/ADempiere/modules/core'
import { IListProductPriceItemData, IPointOfSalesData } from '@/ADempiere/modules/pos'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { formatPrice, formatQuantity } from '@/ADempiere/shared/utils/valueFormat'
import { Table } from 'element-ui'
import { Component, Mixins, Prop, Ref, Watch } from 'vue-property-decorator'
import CustomPagination from '../../../Pagination'
import MixinForm from '../../MixinForm'
import fieldsListProductPrice from '../fieldsList'
import Template from './template.vue'
import FieldDefinition from '@/ADempiere/shared/components/Field'

@Component({
  name: 'ProductList',
  components: { CustomPagination, FieldDefinition },
  mixins: [MixinForm, Template]
})
export default class ProductList extends Mixins(MixinForm) {
  @Ref() readonly singleTable!: Table
  @Prop({ type: Boolean, default: true }) isSelectable?: boolean
  @Prop({ type: String, default: 'isShowPopoverField' }) popoverName?: string
  @Prop({ type: Array, default: () => [] }) reportAsociated!: any[]
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
  fieldsList = fieldsListProductPrice
  public isCustomForm = true
  public timeOut: any = null
  private currentRow: any
  public attribute = ''
  public indexTable = 0

  // Computed properties
  get defaultImage() {
    return require('@/image/ADempiere/pos/no-image.jpg')
  }

  get isShowProductsPriceList(): any {
    const productPrice: IListProductPriceItemData = this.$store.state.listProductPriceModule.productPrice
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
      options: ['enter'],
      up: ['arrowup'],
      down: ['arrowdown']
    }
  }

  get isReadyFromGetData(): boolean {
    const { isLoaded, isReload } = this.productPrice
    return (!isLoaded || isReload) // && this.isShowProductsPriceList
  }

  get listPrice(): number {
    const pos: IPointOfSalesData | undefined = this.$store.getters[Namespaces.PointOfSales + '/' + 'getCurrentPOS']
    if (pos) {
      return pos.priceList.id
    }
    return 0
  }

  get process() {
    if (this.reportAsociated) {
      const process = this.reportAsociated.map(element => {
        const findProcess = this.$store.getters[Namespaces.ProcessDefinition + '/' + 'getProcess'](element.uuid)
        if (findProcess) {
          return {
            ...element,
            name: findProcess.name,
            id: findProcess.id
          }
        }
        return []
      })
      return process
    }
    return []
  }

  // Watchers
  @Watch('isReadyFromGetData')
  handleIsReadyFromGetData(isToLoad: boolean) {
    this.loadProductsPricesList()
  }

  @Watch('indexTable')
  handleIndexTable(value: number) {
    this.setCurrent(this.listWithPrice[value])
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

  formatQuantity = formatQuantity

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
    this.findPosition(val)
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
      case 'down':
        if (this.indexTable < (this.listWithPrice.length - 1)) {
          this.indexTable++
        }
        break
      case 'up':
        if (this.indexTable > 0) {
          this.indexTable--
        }
        break
      case 'options':
        this.$store.commit(Namespaces.ListProductPrice + '/' + 'setIsReloadProductPrice')
        break
    }
  }

  loadProductsPricesList() {
    this.$store.dispatch(Namespaces.ListProductPrice + '/' + 'listProductPriceFromServerProductInfo', {
      containerUuid: undefined,
      pageNumber: undefined,
      searchValue: undefined
    })
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

  associatedprocesses(product: any, report: { parametersList: { columnName: string, value: any }[] }) {
    report.parametersList.push({ columnName: 'M_Product_ID', value: product }, { columnName: 'M_PriceList_ID', value: this.listPrice })
    this.$store.dispatch('processOption', {
      action: report,
      parametersList: report.parametersList,
      reportFormat: 'pdf',
      routeToDelete: this.$route
    })
  }

  findPosition(current: any) {
    const arrow: number = this.listWithPrice.findIndex(element => {
      if (element.product.id === current.product.id) {
        return element
      }
    })
    this.indexTable = arrow
  }

  subscribeChanges() {
    return this.$store.subscribe((mutation, state) => {
      // if (!this.isEmptyValue(this.listWithPrice)) {
      //   this.setCurrent(this.listWithPrice[0])
      // }
      if (mutation.type === Namespaces.FieldValue + '/' + 'updateValueOfField' &&
          !mutation.payload.columnName.includes('DisplayColumn') &&
          mutation.payload.containerUuid === this.metadata.containerUuid) {
        clearTimeout(this.timeOut)
        this.timeOut = setTimeout(() => {
          this.$store.dispatch(Namespaces.ListProductPrice + '/' + 'updateSearch', mutation.payload.value)
          if (this.productPrice.isLoaded) {
            this.$store.commit(Namespaces.ListProductPrice + '/' + 'setIsReloadProductPrice')
          }
        }, 1000)
      }
    })
  }
}
