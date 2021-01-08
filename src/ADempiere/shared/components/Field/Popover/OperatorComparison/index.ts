import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Template from './template.vue'

@Component({
  name: 'FieldOperatorComparison',
  mixins: [Template]
})
export default class FieldOperatorComparison extends Vue {
    @Prop({ type: Object, required: true }) fieldAttributes!: any
    public value?: any = this.fieldAttributes.operator

    // Methods
    changeOperator(operatorValue: any): void {
      this.$store.dispatch('changeFieldAttribure', {
        containerUuid: this.fieldAttributes.containerUuid,
        columnName: this.fieldAttributes.columnName,
        attributeName: 'operator',
        attributeValue: operatorValue
      })
    }

    /**
       * @param {mixed} value, main value in component
       * @param {mixed} valueTo, used in end value in range
       * @param {string} label, or displayColumn to show in select
       */
    handleChange(value: any): void {
      // const sendParameters = {
      //   parentUuid: this.fieldAttributes.parentUuid,
      //   containerUuid: this.fieldAttributes.containerUuid,
      //   field: this.fieldAttributes,
      //   panelType: this.fieldAttributes.panelType,
      //   columnName: this.fieldAttributes.columnName,
      //   newValue: value === 'NotSend' ? this.value : value,
      //   isAdvancedQuery: true,
      //   isSendToServer: !(value === 'NotSend'),
      //   isSendCallout: false
      // }
      // this.$store.dispatch('notifyFieldChange', {
      //   ...sendParameters,
      //   isChangedOldValue: this.fieldAttributes.componentPath === 'FieldYesNo' && Boolean(value === 'NotSend')
      // })
      return undefined
    }

    // Watchers
    @Watch('fieldAttributes.operator')
    handleOperatorChange(newValue: any) {
      this.value = newValue
      if (this.fieldAttributes.value ||
          ['NULL', 'NOT_NULL'].includes(this.fieldAttributes.operator)) {
        this.handleChange(this.fieldAttributes.value)
      }
    }
}
