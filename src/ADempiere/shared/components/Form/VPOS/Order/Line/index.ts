import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Field from '@/ADempiere/shared/components/Field'
import fieldsListLine from './fieldsListLine'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { createFieldFromDictionary, IFieldTemplateData } from '@/ADempiere/shared/utils/lookupFactory'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import Template from './template.vue'
import { validatePin } from '@/ADempiere/modules/pos/POSService'
import { IFieldLocation } from '@/ADempiere/shared/components/Field/FieldLocation/fieldList'
import { ICurrentPointOfSalesData, IPOSAttributesData, OrderLinesState } from '@/ADempiere/modules/pos'

@Component({
  name: 'FieldLine',
  mixins: [Template],
  components: {
    Field
  }
})
export default class FieldLine extends Vue {
    @Prop({
      type: Object,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      default: () => {}
    }) dataLine: any

    @Prop({
      type: Boolean,
      default: false
    }) showField!: boolean

    @Prop({
      type: Object,
      default: () => { return {} }
    }) currentLine: any

      // Data
      private metadataList: any[] = []
      private panelMetadata: any = {}
      private isLoaded = false
      private isLoadedField = false
      private panelType: PanelContextType = PanelContextType.Custom
      private fieldsListLine: IFieldLocation[] = fieldsListLine
      private fieldsList: any[] = []
      private pin = ''
      private visible = false
      private columnNameVisible = ''
      private unsubscribe: Function = () => {}

      // Computed properties
      get isModifyPrice(): boolean {
        const pos = (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales
        if (!isEmptyValue(pos.isModifyPrice)) {
          return pos.isModifyPrice!
        }
        return false
      }

      get currentPointOfSales(): ICurrentPointOfSalesData {
        return (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales
      }

      get validatePin() {
        return (this.$store.state[Namespaces.OrderLines] as OrderLinesState).validatePin
      }

      get isPosRequiredPin(): boolean {
        const pos = (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales
        if (!isEmptyValue(pos.isPosRequiredPin) && !this.validatePin) {
          return pos.isPosRequiredPin!
        }
        return false
      }

      created() {
        console.log('currentLine')
        console.log(this.currentLine)
      }

      beforeMount() {
        this.unsubscribe = this.subscribeChanges()
      }

      beforeDestroy() {
        this.unsubscribe()
      }

      // Watchers
      @Watch('showField')
      handleShowFieldChange(value: boolean) {
        this.visible = false
        if (value && isEmptyValue(this.metadataList) && (this.dataLine.uuid === (this.$store.state[Namespaces.OrderLines] as OrderLinesState).line.uuid)) {
          this.metadataList = this.setFieldsList()
          this.isLoadedField = true
        }
        if (value) {
          this.fillOrderLineQuantities({
            currentPrice: this.currentLine.price,
            quantityOrdered: this.currentLine.quantity,
            discount: this.currentLine.discountRate
          })
          this.isLoadedField = true
        }
      }

      // Methods
      createFieldFromDictionary = createFieldFromDictionary

      notSubmitForm(event: any) {
        event.preventDefault()
        return false
      }

      setFieldsList(): IFieldTemplateData[] {
        const fieldsList: IFieldTemplateData[] = []
        // Product Code
        this.fieldsListLine.forEach((element: any) => {
          this.createFieldFromDictionary(element)
            .then(metadata => {
              const data = metadata
              fieldsList.push({
                ...data,
                containerUuid: 'line'
              })
            }).catch(error => {
              console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
            })
        })
        return fieldsList
      }

      fillOrderLineQuantities(params: {
        currentPrice: any
        quantityOrdered: any
        discount: any
      }): void {
        const { currentPrice, quantityOrdered, discount } = params
        const containerUuid = 'line'
        // Editable fields
        if (!isEmptyValue(quantityOrdered)) {
          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            containerUuid: 'line',
            columnName: 'QtyEntered',
            value: quantityOrdered
          })
        }
        if (!isEmptyValue(currentPrice)) {
          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            containerUuid,
            columnName: 'PriceEntered',
            value: currentPrice
          })
        }
        if (!isEmptyValue(discount)) {
          this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
            containerUuid,
            columnName: 'Discount',
            value: discount
          })
        }
      }

      closePing() {
        const popover = this.$refs.ping as Element[]
        ((this.$refs.ping as Element[])[popover.length - 1] as any).showPopper = false
        this.visible = false
      }

      checkclosePing() {
        validatePin({
          posUuid: this.currentPointOfSales.uuid!,
          pin: this.pin
        })
          .then(response => {
            this.$store.commit('pin', true)
            this.pin = ''
          })
          .catch(error => {
            console.error(error.message)
            this.$message({
              type: 'error',
              message: error.message,
              showClose: true
            })
            this.pin = ''
          })
        this.closePing()
      }

      subscribeChanges() {
        return this.$store.subscribe((mutation, state) => {
          if (mutation.type === Namespaces.Event + '/' + 'addFocusGained' && this.isPosRequiredPin &&
          (mutation.payload.columnName === 'PriceEntered' || mutation.payload.columnName === 'Discount')) {
            this.columnNameVisible = mutation.payload.columnName
            this.visible = true
          }
        })
      }
}
