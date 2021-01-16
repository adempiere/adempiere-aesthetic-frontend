import { IFieldLocation } from '@/ADempiere/shared/components/Field/FieldLocation/fieldList'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { formatPrice } from '@/ADempiere/shared/utils/valueFormat'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import MixinForm from '../../../MixinForm'
import fieldListConvertAmountCollection from './fieldListConvertAmountCollection'
import Template from './template.vue'

@Component({
  name: 'ConvertAmount',
  mixins: [MixinForm, Template]
})
export default class ConvertAmount extends Mixins(MixinForm) {
    @Prop({ type: Array, default: undefined }) isAddTypePay?: any[] = undefined
    @Prop({ type: Object, default: undefined }) currency: any = undefined
    @Prop({ type: Number, default: undefined }) amount?: number = undefined
    @Prop({ type: Number, default: undefined }) convert?: number = undefined
    @Prop({
      type: Object,
      default: {
        uuid: 'Collection-Convert-Amount',
        containerUuid: 'Collection-Convert-Amount'
      }
    }) metadata: any = {
      uuid: 'Collection-Convert-Amount',
      containerUuid: 'Collection-Convert-Amount'
    }

    public fieldList: IFieldLocation[] = fieldListConvertAmountCollection

    // Computed properties
    get displayCurrency() {
      return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        containerUuid: this.containerUuid,
        columnName: 'DisplayColumn_C_Currency_ID'
      })
    }

    // Methods
    formatPrice = formatPrice

    defaultValueCurrency(): void {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'DisplayColumn_C_Currency_ID',
        value: this.currency.iSOCode
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID',
        value: this.currency.id
      })
    }

    // Hooks
    created() {
      this.defaultValueCurrency()
    }
}
