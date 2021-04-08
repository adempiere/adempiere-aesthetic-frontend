import { IPointOfSalesData } from '@/ADempiere/modules/pos'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Collection from './Collection'
import KeyLayout from './KeyLayout'
import Options from './Options'
import Order from './Order'
import Template from './template.vue'

@Component({
  name: 'VPOS',
  mixins: [Template],
  components: {
    Order,
    KeyLayout,
    Options,
    Collection
  }
})
export default class VPOS extends Vue {
    @Prop({ type: Object, required: true }) metadata!: any
    // eslint-disable-next-line
    public unsubscribePOSList: Function = () => {}

    // Computed properties
    // options to POS, panel left
    get isShowedPOSOptions(): boolean {
      return this.$store.getters[
        Namespaces.PointOfSales + '/' + 'getIsShowPOSOptions'
      ]
    }

    set isShowedPOSOptions(value: boolean) {
      this.$store.commit(Namespaces.PointOfSales + '/' + 'setShowPOSOptions', value)
    }

    get isShowedPOSKeyLaout(): boolean {
      return this.$store.getters[
        Namespaces.PointOfSales + '/' + 'getShowPOSKeyLayout'
      ]
    }

    get showCollection(): boolean {
      return this.$store.getters[
        Namespaces.PointOfSales + '/' + 'getShowCollectionPos'
      ]
    }

    get pointOfSalesId(): number | undefined {
      const currentPOS: IPointOfSalesData | undefined = this.$store.getters[
        Namespaces.PointOfSales + '/' + 'getCurrentPOS'
      ]
      if (currentPOS && !isEmptyValue(currentPOS.id)) {
        return currentPOS.id
      }
      return undefined
    }

    // Watchers
    @Watch('isShowedPOSOptions')
    handleIsShowedPOSOptionsChange(value: boolean) {
      if (value) {
        if (this.isShowedPOSKeyLaout) {
          this.$store.dispatch(Namespaces.Utils + '/' + 'changeWidthRight', 3)
        }
      } else {
        this.$store.dispatch(Namespaces.Utils + '/' + 'changeWidthRight', 3)
      }
    }

    // Methods
    posListWithOrganization() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'user/SET_ORGANIZATION') {
          this.$store.dispatch(Namespaces.PointOfSales + '/' + 'listPointOfSalesFromServer')
        }
      })
    }

    onDragKeyLayout(size: number[]) {
      const sizeWidthRight: number = size[1] / 10
      this.$store.dispatch(Namespaces.Utils + '/' + 'changeWidthRight', Math.trunc(sizeWidthRight))
    }

    onDragOption(size: number[]) {
      const sizeWidthLeft: number = size[0] / 10
      this.$store.dispatch(Namespaces.Utils + '/' + 'changeWidthLeft', Math.trunc(sizeWidthLeft))
    }

    // Hooks
    created() {
      // load pont of sales list
      if (
        isEmptyValue(this.$store.getters[
          Namespaces.PointOfSales + '/' + 'getSellingPointsList'
        ])
      ) {
        let posToSet
        // set pos id with query path
        this.$store.dispatch(Namespaces.PointOfSales + '/' + 'listPointOfSalesFromServer', posToSet)
      }

      this.unsubscribePOSList = this.posListWithOrganization()
    }

    mounted() {
      if (isEmptyValue(this.$route.query) || isEmptyValue(this.$route.query.pos)) {
        this.$router.push(
          {
            params: {
              ...this.$route.params
            },
            query: {
              ...this.$route.query,
              pos: String(this.pointOfSalesId)
            }
          }
        )
      }
    }

    beforeDestroy() {
      this.unsubscribePOSList()
    }
}
