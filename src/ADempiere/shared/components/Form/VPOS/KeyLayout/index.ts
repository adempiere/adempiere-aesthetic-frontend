import { Component, Vue, Watch } from 'vue-property-decorator'
import VueContentLoading from '@/ADempiere/shared/components/ContentLoader'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import {
  IOrderLineDataExtended,
  IPointOfSalesData
} from '@/ADempiere/modules/pos'
import { formatQuantity } from '@/ADempiere/shared/utils/valueFormat'
import { requestImage } from '@/ADempiere/modules/persistence/PersistenceService/persistence'
import { buildImageFromArrayBuffer } from '@/ADempiere/shared/utils/resource'
import Template from './template.vue'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'

@Component({
  name: 'KeyLayout',
  components: {
    VueContentLoading
  },
  mixins: [Template]
})
export default class KeyLayout extends Vue {
    public resource: any = {}
    public isLoadedKeyLayout = false
    public valuesImage: any[] = [
      {
        identifier: 'undefined',
        value: '',
        isLoaded: true
      }
    ]

    // Computed properties
    get defaultImage() {
      return require('@/image/ADempiere/pos/no-image.jpg')
    }

    get currentPoint(): IPointOfSalesData | undefined {
      return this.$store.getters[
        Namespaces.PointOfSales + '/' + 'getCurrentPOS'
      ]
    }

    get listOrderLine(): IOrderLineDataExtended[] {
      return this.$store.getters[
        Namespaces.Order + '/' + 'getPos'
      ].lineOrder
    }

    get getKeyLayout() {
      return this.$store.getters[Namespaces.KeyLayout + '/' + 'getKeyLayout']
    }

    get getKeyList(): any[] | undefined {
      // return this.getKeyLayout.orderList
      return this.getKeyLayout.keysList
    }

    get getLayoutHeader() {
      const keyLayout = this.getKeyLayout
      if (keyLayout) {
        return keyLayout
      }
      return {
        name: undefined,
        description: undefined
      }
    }

    // TODO: Verify with panel collection
    get isShowedPOSKeyLayout(): boolean {
      return this.$store.getters[
        Namespaces.PointOfSales + '/' + 'getShowPOSKeyLayout'
      ]
    }

    get isReadyFromGetData(): boolean {
      const { isLoaded, isReload } = this.getKeyLayout
      return (!isLoaded || isReload) && this.isShowedPOSKeyLayout
    }

    get size(): number {
      const size: number = this.$store.getters[Namespaces.Utils + '/' + 'getWidthRight']
      return 24 / size
    }

    // Watchers
    @Watch('isReadyFromGetData')
    handleIsReadyFromGetDataChange(isToLoad: boolean) {
      if (isToLoad) {
        this.loadKeyLayout()
      }
    }

    // Methods
    formatQuantity = formatQuantity

    loadKeyLayout(uuid?: string): void {
      uuid = uuid || undefined
      const currentPOS: IPointOfSalesData | undefined = this.currentPoint
      if (isEmptyValue(currentPOS) || isEmptyValue(currentPOS!.uuid)) {
        this.$message({
          type: 'warning',
          message: 'Without POS Terminal',
          showClose: true
        })
        return
      }

      this.$store.dispatch(Namespaces.KeyLayout + '/' + 'getKeyLayoutFromServer', uuid).then(() => {
        this.isLoadedKeyLayout = true
      })
    }

    getImage(resource: any): void {
      if (isEmptyValue(resource) || isEmptyValue(resource.fileName)) {
        return
      }

      const { fileName, contentType } = resource
      if (!this.valuesImage.some(item => item.identifier === fileName)) {
        this.valuesImage.push({
          identifier: fileName,
          value: '',
          isLoaded: false
        })
      }
      if (this.resource[fileName]) {
        this.valuesImage.forEach(item => {
          if (item.identifier === fileName) {
            item.value = this.resource[fileName]
            item.isLoaded = true
          }
        })
      } else {
        // Reload
        if (!this.valuesImage.some(item => item.identifier === fileName)) {
          this.valuesImage.push({
            identifier: fileName,
            value: '',
            isLoaded: false
          })
        }
        // the name of the image plus height and width of the container is sent
        requestImage({
          file: fileName,
          width: 300,
          height: 300
        }).then(response => {
          const responseImage = <any[]>response.data
          const arrayBufferAsImage = buildImageFromArrayBuffer({
            arrayBuffer: responseImage,
            contentType
          })

          this.resource[fileName] = arrayBufferAsImage
          this.valuesImage.forEach(item => {
            if (item.identifier === fileName) {
              item.value = arrayBufferAsImage
              item.isLoaded = true
            }
          })
        })
      }
    }

    setKeyActionToOrderLine(keyValue: any): void {
      if (!isEmptyValue(keyValue.subKeyLayoutUuid)) {
        this.loadKeyLayout(keyValue.subKeyLayoutUuid)
      } else {
        this.$store.dispatch(Namespaces.Event + '/' + 'notifyActionKeyPerformed', {
          columnName: 'ProductValue',
          value: {
            QtyEntered: keyValue.quantity,
            value: keyValue.productValue
          }
        })
      }
    }

    handleCommand(command: any): void {
      const point = this.$store.getters[
        Namespaces.PointOfSales + '/' + 'getPointOfSalesUuid'
      ].keyLayoutUuid
      const toReturn = this.getKeyList!.find(
        keyLayoutItem => keyLayoutItem.subKeyLayoutUuid === point
      )

      let keyLayoutUuid = this.currentPoint!.keyLayoutUuid
      if (!isEmptyValue(toReturn)) {
        keyLayoutUuid = toReturn.subKeyLayoutUuid
      }
      this.loadKeyLayout(keyLayoutUuid)
    }

    getDefaultImage(keyValue: any) {
      const { fileName } = keyValue.resourceReference

      if (isEmptyValue(fileName)) {
        return true
      }

      const image = this.valuesImage.find(
        item => item.identifier === fileName
      )
      if (isEmptyValue(image)) {
        return false
      }
      return image.isLoaded
    }

    getImageFromSource(keyValue: any) {
      const { fileName } = keyValue.resourceReference

      if (isEmptyValue(fileName)) {
        return this.defaultImage
      }

      // const image = this.valuesImage.find(item => item.identifier === fileName).value
      const image = this.resource[fileName]
      if (isEmptyValue(image)) {
        return this.defaultImage
      }
      return image
    }

    // Hooks
    mounted() {
      if (this.isReadyFromGetData) {
        this.loadKeyLayout()
      }
    }
}
