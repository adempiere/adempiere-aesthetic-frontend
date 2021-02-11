import { requestGetProductPrice } from '@/ADempiere/modules/core/CoreService'
import { requestImage } from '@/ADempiere/modules/persistence/PersistenceService/persistence'
import { buildImageFromArrayBuffer } from '@/ADempiere/shared/utils/resource'
import { formatPercent, formatPrice } from '@/ADempiere/shared/utils/valueFormat'
import { Component, Mixins, Prop, Ref } from 'vue-property-decorator'
import MixinForm from '../MixinForm'
import { IProductCodeData } from '../PriceChecking/fieldList'
import fieldsList from './fieldsListBarCode'
import Template from './template.vue'

@Component({
  name: 'BarcodeReader',
  mixins: [MixinForm, Template]
})
export default class BarcodeReader extends Mixins(MixinForm) {
 @Ref() readonly ProductValue?: HTMLElement[]
 @Prop({
   type: Object,
   default: () => {
     return {
       uuid: 'Bar-code-Reader',
       containerUuid: 'Bar-code-Reader',
       fieldsList
     }
   }
 }) metadata!: { uuid: string, containerUuid: string, fieldsList: any[] }

 public fieldsList: IProductCodeData[] = fieldsList
 private productPrice: any = {}
 private organizationBackground = ''
 private currentImageOfProduct = ''
 private search = 'sad'
 // eslint-disable-next-line
 public unsubscribe: Function = () => {}

 // Computed properties
 get organizationImagePath(): string {
   return this.$store.getters.corporateBrandingImage
 }

 get defaultImage() {
   return require('@/image/ADempiere/priceChecking/no-image.jpg')
 }

 get defaultImageLogo() {
   return require('@/image/ADempiere/priceChecking/todoagro.png')
 }

 get backgroundForm(): string {
   if (!this.currentImageOfProduct) {
     return this.organizationBackground
   }
   return this.currentImageOfProduct
 }

 created() {
   this.unsubscribe = this.subscribeChanges()
 }

 mounted() {
   this.getImage()
 }

 beforeDestroy() {
   this.unsubscribe()
 }

 async getImage(imageName = ''): Promise<string> {
   let isSetOrg = false
   if (!imageName) {
     if (this.organizationBackground) {
       return this.organizationBackground
     }
     isSetOrg = true
     imageName = this.organizationImagePath
   }
   // the name of the image plus the height and width of the container is sent
   const imageBuffer = await requestImage({
     file: imageName,
     width: 750,
     height: 380
   }).then(responseImage => {
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
      // console.log(mutation.type)
      // if ((mutation.type === 'addActionKeyPerformed') && mutation.payload.columnName === 'ProductValue') {
      //   // cleans all values except column name 'ProductValue'
      //   this.search = mutation.payload.value
      //   if (this.search.length) {
      //     requestGetProductPrice({
      //       searchValue: mutation.payload.value
      //     })
      //       .then(productPrice => {
      //         const { product, taxRate, priceStandard: priceBase } = productPrice
      //         const { rate } = taxRate
      //         const { imageUrl: image } = product
      //         this.productPrice = {
      //           productName: product.name,
      //           productDescription: product.description,
      //           priceBase,
      //           priceStandard: productPrice.priceStandard,
      //           priceList: productPrice.priceList,
      //           priceLimit: productPrice.priceLimit,
      //           taxRate: rate,
      //           image,
      //           taxName: taxRate.name,
      //           taxIndicator: taxRate.taxIndicator,
      //           taxAmt: this.getTaxAmount(priceBase, rate),
      //           grandTotal: this.getGrandTotal(priceBase, rate),
      //           currency: productPrice.currency
      //         }
      //       })
      //       .catch(error => {
      //         this.$message({
      //           type: 'info',
      //           message: error.message,
      //           showClose: true
      //         })
      //         this.productPrice = {}
      //       })
      //       .finally(() => {
      //         this.$store.commit('updateValueOfField', {
      //           containerUuid: this.containerUuid,
      //           columnName: 'ProductValue',
      //           value: ''
      //         })
      //         this.search = ''
      //         this.currentImageOfProduct = ''
      //         if (!this.productPrice.image) {
      //           this.getImage(this.productPrice.image)
      //         }
      //       })
      //   }
      // }
    })
  }

  getTaxAmount(basePrice: number, taxRate: number): number {
    if (!(basePrice) || !(taxRate)) {
      return 0
    }
    return (basePrice * taxRate) / 100
  }

  getGrandTotal(basePrice: number, taxRate: number): number {
    if (!(basePrice)) {
      return 0
    }
    return basePrice + this.getTaxAmount(basePrice, taxRate)
  }
}
