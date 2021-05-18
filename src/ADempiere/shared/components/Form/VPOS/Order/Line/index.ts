import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Field from '@/ADempiere/shared/components/Field'
import fieldsListLine from './fieldsListLine'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { createFieldFromDictionary, IFieldTemplateData } from '@/ADempiere/shared/utils/lookupFactory'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import Template from './template.vue'
import { IFieldLocation } from '@/ADempiere/shared/components/Field/FieldLocation/fieldList'
import { IPOSAttributesData } from '@/ADempiere/modules/pos'

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
      private input = ''
      private visible = false

      // Computed properties
      get isModifyPrice(): boolean {
        const pos = (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales
        if (!isEmptyValue(pos.isModifyPrice)) {
          return (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales.isModifyPrice!
        }
        return false
      }

      get isPosRequiredPin(): boolean {
        const pos = (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales
        if (!isEmptyValue(pos.isPosRequiredPin)) {
          return (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales.isPosRequiredPin!
        }
        return false
      }

      created() {
        console.log('currentLine')
        console.log(this.currentLine)
      }

      // Watchers
      @Watch('showField')
      handleShowFieldChange(value: boolean) {
        console.log('showFieldChange')
        if (value && isEmptyValue(this.metadataList) && (this.dataLine.uuid === this.currentLine.uuid)) {
          this.setFieldsList()
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
      }
}
