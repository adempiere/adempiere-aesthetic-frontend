import { Namespaces } from '@/ADempiere/shared/utils/types'
import { formatPrice } from '@/ADempiere/shared/utils/valueFormat'
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import MixinForm from '../../../MixinForm'
import fieldListConvertAmountCollection from './fieldListConvertAmountCollection'
import Template from './template.vue'
import FieldDefinition from '@/ADempiere/shared/components/Field'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { ICurrentPointOfSalesData, IPOSAttributesData } from '@/ADempiere/modules/pos'
import { IConversionRateData } from '@/ADempiere/modules/core'

@Component({
  name: 'ConvertAmount',
  components: {
    FieldDefinition
  },
  mixins: [MixinForm, Template]
})
export default class ConvertAmount extends Mixins(MixinForm) {
  @Prop({ type: Array, default: undefined }) isAddTypePay?: any[]
  @Prop({ type: Object, default: undefined }) currency?: any
  @Prop({ type: Number, default: undefined }) amount!: number
  @Prop({ type: Number, default: undefined }) convert?: number
  @Prop({
    type: Object,
    default: () => {
      return {
        uuid: 'Collection-Convert-Amount',
        containerUuid: 'Collection-Convert-Amount'
      }
    }
  })
  metadata: any

  @Prop({ type: Boolean, default: false }) isOpen!: boolean

  // public fieldsList: IFieldLocation[] = fieldListConvertAmountCollection
  fieldsList = fieldListConvertAmountCollection
  public amountConvertionTotal = this.amount

  // Computed properties
  get displayCurrency() {
    return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField'](
      {
        containerUuid: 'Collection-Convert-Amount',
        columnName: 'DisplayColumn_C_Currency_ID'
      }
    )
  }

  get typeCurrency() {
    return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField'](
      {
        containerUuid: 'Collection-Convert-Amount',
        columnName: 'C_Currency_ID'
      }
    )
  }

  get currencyUuid() {
    return this.$store.getters[Namespaces.FieldValue + '/' + 'getValueOfField'](
      {
        containerUuid: 'Collection-Convert-Amount',
        columnName: 'C_Currency_ID_UUID'
      }
    )
  }

  get currentPointOfSales(): ICurrentPointOfSalesData {
    return (this.$store.getters[Namespaces.PointOfSales + '/' + 'posAttributes'] as IPOSAttributesData).currentPointOfSales
  }

  get pointOfSalesCurrency() {
    // const currency = this.currentPointOfSales
    if (!isEmptyValue(this.currentPointOfSales.priceList)) {
      return {
        ...this.currentPointOfSales.priceList!.currency,
        amountConvertion: 1
      }
    }
    return {
      uuid: '',
      iSOCode: '',
      curSymbol: '',
      amountConvertion: 1
    }
  }

  get dateRate(): Partial<IConversionRateData> | undefined {
    return (this.$store.getters[Namespaces.Payments + '/' + 'getConvertionRate'] as Partial<IConversionRateData>[]).find((currency) => {
      if (currency.id === this.typeCurrency) {
        return currency
      }
    })
  }

  @Watch('dateRate')
  handleDateRateChange(value: Partial<IConversionRateData> | undefined) {
    if (value && !isEmptyValue(value.amountConvertion)) {
      this.amountConvertionTotal = this.amount! / value.amountConvertion!
    } else {
      this.amountConvertionTotal = this.amount!
    }
  }

  @Watch('currencyUuid')
  handleCurrencyUuidChange(value: string | undefined) {
    const listCurrency = (this.$store.getters[Namespaces.Payments + '/' + 'getConvertionRate'] as Partial<IConversionRateData>[]).find(currency => {
      if (currency.uuid === value) {
        return currency
      }
    })
    if (listCurrency === undefined) {
      this.$store.dispatch(Namespaces.Payments + '/' + 'conversionDivideRate', {
        conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
        currencyFromUuid: this.pointOfSalesCurrency.uuid,
        conversionDate: this.formatDate(new Date()),
        currencyToUuid: value
      })
    }
  }

  // Methods
  formatPrice = formatPrice

  formatDate(date: Date): string {
    let month: string = '' + (date.getMonth() + 1)
    let day: string = '' + date.getDate()
    const year: number = date.getFullYear()
    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }
    return [year, month, day].join('-')
  }

  defaultValueCurrency(): void {
    this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
      containerUuid: this.containerUuid,
      columnName: 'DisplayColumn_C_Currency_ID',
      value: this.currency.iSOCode
    })
    this.$store.commit(Namespaces.FieldValue + '/' + 'updateValueOfField', {
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
