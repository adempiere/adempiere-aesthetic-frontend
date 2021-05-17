import { IPointOfSalesData, IPOSAttributesData } from '@/ADempiere/modules/pos'
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

    get listPointOfSales() {
      return (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).listPointOfSales
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
      if (isEmptyValue(this.listPointOfSales)) {
        // set pos id with query path
        this.$store.dispatch(Namespaces.PointOfSales + '/' + 'listPointOfSalesFromServer', this.$route.query.pos)
      }

      this.unsubscribePOSList = this.posListWithOrganization()
    }

    beforeDestroy() {
      this.unsubscribePOSList()
    }
}
