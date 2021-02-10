import { Component, Mixins, Ref } from 'vue-property-decorator'
import MixinForm from '../MixinForm'
import fieldList, { IProductCodeData } from './fieldList'
import Template from './template.vue'

import { requestImage } from '@/ADempiere/modules/persistence/PersistenceService/persistence'
import { buildImageFromArrayBuffer } from '@/ADempiere/shared/utils/resource'
import { AxiosResponse } from 'axios'
import { requestGetProductPrice } from '@/ADempiere/modules/core/CoreService'
import {
  formatPercent,
  formatPrice
} from '@/ADempiere/shared/utils/valueFormat'
import {
  IProductPriceData
} from '@/ADempiere/modules/core/CoreType'
import { request } from 'http'
import { Namespaces } from '@/ADempiere/shared/utils/types'

@Component({
  name: 'PriceChecking',
  mixins: [MixinForm, Template]
})
export default class PriceChecking extends Mixins(MixinForm) {
    public fieldsList: IProductCodeData[] = fieldList
    @Ref() readonly ProductValue?: HTMLElement[]
    public productPrice: any = {}
    public organizationBackground = ''
    public currentImageOfProduct = ''
    public search = 'sad'
    // eslint-disable-next-line
    public unsubscribe: Function = () => {}

    // Computed properties
    get organizationImagePath(): string {
      return this.$store.getters.corporateBrandingImage
    }

    get defaultImage() {
      return require('@/image/ADempiere/priceChecking/no-image.jpg')
    }

    get backgroundForm(): string {
      if (!this.currentImageOfProduct) {
        return this.organizationBackground
      }
      return this.currentImageOfProduct
    }

    // Methods
    async getImage(imageName?: string): Promise<string> {
      imageName = imageName || ''
      let isSetOrg = false
      if (!imageName) {
        if (this.organizationBackground) {
          return this.organizationBackground
        }
        isSetOrg = true
        imageName = this.organizationImagePath
      }
      // the name of the image plus the height of the container is sent
      const imageBuffer = await requestImage({
        file: imageName,
        width: 750,
        height: 380
      }).then((responseImage: AxiosResponse) => {
        const arrayBufferAsImage = buildImageFromArrayBuffer({
          arrayBuffer: responseImage.data
        })

        if (isSetOrg) {
          this.organizationBackground = arrayBufferAsImage
          return arrayBufferAsImage
        }

        this.currentImageOfProduct = arrayBufferAsImage
        return arrayBufferAsImage
      })
      return imageBuffer
    }

    focusProductValue(): void {
        this.ProductValue![0].focus()!
        // eslint-disable-next-line
        this.ProductValue![0].children[0].children[0].children[1].children[0]
    }

    formatPercent = formatPercent

    formatPrice = formatPrice

    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if ((mutation.type === 'updateValueOfField' || mutation.type === 'addFocusGained') && mutation.payload.columnName === 'ProductValue') {
          // cleans all values except column name 'ProductValue'
          this.search = mutation.payload.value
          if (this.search.length >= 6) {
            requestGetProductPrice({
              searchValue: mutation.payload.value
            })
              .then((productPrice: IProductPriceData) => {
                const {
                  product,
                  taxRate,
                  priceStandard: priceBase
                } = productPrice
                const { rate } = taxRate
                const { imageUrl: image } = product

                this.productPrice = {
                  productName: product.name,
                  productDescription: product.description,
                  priceBase,
                  priceStandard: productPrice.priceStandard,
                  priceList: productPrice.priceList,
                  priceLimit: productPrice.priceLimit,
                  taxRate: rate,
                  image,
                  taxName: taxRate.name,
                  taxIndicator: taxRate.taxIndicator,
                  taxAmt: this.getTaxAmount(priceBase, rate),
                  grandTotal: this.getGrandTotal(priceBase, rate),
                  currency: productPrice.currency
                }
              })
              .catch(error => {
                this.$message({
                  type: 'info',
                  message: error.message,
                  showClose: true
                })
                this.productPrice = {}
              })
              .finally(() => {
                this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
                  containerUuid: this.containerUuid,
                  columnName: 'ProductValue',
                  value: ''
                })

                this.search = ''
                this.currentImageOfProduct = ''
                if (!this.productPrice.image) {
                  this.getImage(this.productPrice.image)
                }
              })
          }
        }
      })
    }

    getTaxAmount(basePrice: number, taxRate: number): number {
      if (!basePrice || !taxRate) {
        return 0
      }
      return (basePrice * taxRate) / 100
    }

    getGrandTotal(basePrice: number, taxRate: number): number {
      if (!basePrice) {
        return 0
      }
      return basePrice + this.getTaxAmount(basePrice, taxRate)
    }

    // Hooks
    created() {
      this.unsubscribe = this.subscribeChanges()
    }

    mounted() {
      this.getImage()
    }

    beforeDestroy() {
      this.unsubscribe()
    }
}
