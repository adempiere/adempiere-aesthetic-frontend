import { Component, Vue, Watch } from 'vue-property-decorator'
import { IValuesImageData, Namespaces } from '@/ADempiere/shared/utils/types'
import {
  ICurrentPointOfSalesData,
  IKeyData,
  IKeyLayoutOrWithoutResponse,
  IPOSAttributesData
} from '@/ADempiere/modules/pos'
import { formatQuantity } from '@/ADempiere/shared/utils/valueFormat'
import { getImagePath } from '@/ADempiere/shared/utils/resource'
import Template from './template.vue'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'

@Component({
  name: 'KeyLayout',
  mixins: [Template]
})
export default class KeyLayout extends Vue {
    public resource: any = {}
    public isLoadedKeyLayout = false
    public valuesImage: IValuesImageData[] = [
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

    get currentPointOfSales(): ICurrentPointOfSalesData {
      return (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales
    }

    get getKeyLayout() {
      return (this.$store.getters[Namespaces.PointOfSales + '/' + 'getKeyLayout']as IKeyLayoutOrWithoutResponse)
    }

    get getKeyList(): (IKeyData & { isLoded?: boolean })[] | undefined {
      const keylist = this.getKeyLayout.keysList
      if (!isEmptyValue(keylist)) {
        return keylist!.map((item: IKeyData) => {
          return {
            ...item,
            isLoaded: true
          }
        })
      }
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
      return (!isLoaded || isReload!) && this.isShowedPOSKeyLayout
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
      const currentPOS: ICurrentPointOfSalesData | undefined = this.currentPointOfSales
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
      const point = (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales.uuid
      const toReturn = this.getKeyList!.find(
        keyLayoutItem => keyLayoutItem.subKeyLayoutUuid === point
      )

      let keyLayoutUuid = this.currentPointOfSales.keyLayoutUuid
      if (!isEmptyValue(toReturn)) {
        keyLayoutUuid = toReturn!.subKeyLayoutUuid
      }
      this.loadKeyLayout(keyLayoutUuid)
    }

    getDefaultImage(keyValue: IKeyData & { isLoded?: boolean }): boolean {
      const { fileName } = keyValue.resourceReference!

      if (isEmptyValue(fileName)) {
        return true
      }

      const image = this.valuesImage.find(item => item.identifier === fileName)!

      if (isEmptyValue(image)) {
        return false
      }
      return image.isLoaded
    }

    getImageFromSource(keyValue: IKeyData & { isLoded?: boolean }): string {
      const fileName = keyValue.resourceReference?.fileName

      if (isEmptyValue(fileName)) {
        return this.defaultImage
      }

      const image = getImagePath({
        file: fileName!,
        width: 300,
        height: 300
      })

      return image.uri
    }

    // Hooks
    mounted() {
      if (this.isReadyFromGetData) {
        this.loadKeyLayout()
      }
    }
}
