import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Order from '@/ADempiere/shared/components/Form/VPOS/Order'
import KeyLayout from '@/ADempiere/shared/components/Form/VPOS/KeyLayout'
import Options from '@/ADempiere/shared/components/Form/VPOS/Options'
import Collection from '@/ADempiere/shared/components/Form/VPOS/Collection'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { IPOSAttributesData } from '@/ADempiere/modules/pos'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import Template from './template.vue'

@Component({
  name: 'VPosMobile',
  mixins: [Template],
  components: {
    Order,
    KeyLayout,
    Options,
    Collection
  }
})
export default class VPosMobile extends Vue {
  @Prop({ type: Object, required: true }) metadata: any
  public unsubscribePOSList: Function = () => {}

  // Computed properties
  get isShowedPOSKeyLayout(): boolean {
    return this.$store.getters[
      Namespaces.PointOfSales + '/' + 'getShowPOSKeyLayout'
    ] as boolean
  }

  set isShowedPOSKeyLayout(value: boolean) {
    this.$store.commit(
      Namespaces.PointOfSales + '/' + 'setShowPOSKeyLayout',
      value
    )
  }

  get isShowedPOSOptions(): boolean {
    return this.$store.getters[
      Namespaces.PointOfSales + '/' + 'getIsShowPOSOptions'
    ]
  }

  set isShowedPOSOptions(value: boolean) {
    this.$store.commit(
      Namespaces.PointOfSales + '/' + 'setShowPOSOptions',
      value
    )
  }

  // options to POS, panel left
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
    return (this.$store.getters[
      Namespaces.PointOfSales + '/' + 'posAttributes'
    ] as IPOSAttributesData).listPointOfSales
  }

  // Watch
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

  // Hooks
  created() {
    // load pont of sales list
    if (isEmptyValue(this.listPointOfSales)) {
      // set pos id with query path
      this.$store.dispatch(
        Namespaces.PointOfSales + '/' + 'listPointOfSalesFromServer',
        this.$route.query.pos
      )
    }
    this.unsubscribePOSList = this.posListWithOrganization()
  }

  beforeDestroy() {
    this.unsubscribePOSList()
  }

  // Methods
  posListWithOrganization() {
    return this.$store.subscribe((mutation, state) => {
      if (mutation.type === Namespaces.User + '/' + 'SET_ORGANIZATION') {
        this.$store.dispatch(
          Namespaces.PointOfSales + '/' + 'listPointOfSalesFromServer'
        )
      }
    })
  }

  onDragKeyLayout(size: number[]) {
    const sizeWidthRight: number = size[1] / 10
    this.$store.dispatch(
      Namespaces.Utils + '/' + 'changeWidthRight',
      Math.trunc(sizeWidthRight)
    )
  }

  onDragOption(size: number[]) {
    const sizeWidthLeft: number = size[0] / 10
    this.$store.dispatch(
      Namespaces.Utils + '/' + 'changeWidthLeft',
      Math.trunc(sizeWidthLeft)
    )
  }
}
