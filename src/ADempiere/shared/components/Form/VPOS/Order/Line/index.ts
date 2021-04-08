import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Field from '@/ADempiere/shared/components/Field'
import fieldsListLine from './fieldsListLine'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { createFieldFromDictionary, IFieldTemplateData } from '@/ADempiere/shared/utils/lookupFactory'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import Template from './template.vue'

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
      default: true
    }) showField!: boolean

      // Data
      private metadataList: any[] = []
      private panelMetadata: any = {}
      private isLoaded = false
      private panelType: PanelContextType = PanelContextType.Custom
      private fieldsListLine = fieldsListLine

      // Watchers
      @Watch('showField')
      handleShowFieldChange(value: boolean) {
        if (value && isEmptyValue(this.metadataList)) {
          this.setFieldsList()
        }
        if (value) {
          this.fillOrderLineQuantities({
            currentPrice: this.dataLine.price,
            quantityOrdered: this.dataLine.quantity,
            discount: this.dataLine.discountRate
          })
        }
      }

      mounted() {
        console.log('props')
        console.log(this.$props)
      }

      // Methods
      createFieldFromDictionary = createFieldFromDictionary

      notSubmitForm(event: any) {
        event.preventDefault()
        return false
      }

      setFieldsList(): void {
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
        this.metadataList = fieldsList
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
}
