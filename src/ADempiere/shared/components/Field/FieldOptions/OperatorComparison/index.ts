import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import Template from './template.vue'
import {
  computed,
  ComputedRef,
  defineComponent,
  ref,
  WritableComputedRef
} from '@vue/composition-api'

export default defineComponent({
  name: 'FieldOperatorComparison',
  mixins: [Template],
  props: {
    fieldAttributes: {
      type: Object,
      required: true
    }
  },
  setup(props, { root }) {
    const operatorsList = ref(props.fieldAttributes.operatorsList)
    const currentOperator: WritableComputedRef<string | undefined> = computed({
      get() {
        const { columnName, containerUuid } = props.fieldAttributes
        const { operator } = root.$store.getters[
          Namespaces.Panel + '/' + 'getFieldFromColumnName'
        ]({
          containerUuid,
          columnName
        }) as IFieldDataExtendedUtils
        return operator
      },
      set(newValue: string | undefined) {
        const { columnName, containerUuid } = props.fieldAttributes
        root.$store.dispatch(Namespaces.Panel + '/' + 'changeFieldAttribure', {
          containerUuid,
          columnName,
          attributeName: 'operator',
          attributeValue: newValue
        })
      }
    })
    const fieldValue: ComputedRef = computed(() => {
      const { columnName, containerUuid, parentUuid } = props.fieldAttributes
      // main panel values
      return root.$store.getters[
        Namespaces.FieldValue + '/' + 'getValueOfField'
      ]({
        parentUuid,
        containerUuid,
        columnName
      })
    })
    /**
     * @param {mixed} value, main value in component
     */
    const handleChange = (value: any) => {
      const { columnName, containerUuid } = props.fieldAttributes
      root.$store.dispatch(Namespaces.Panel + '/' + 'notifyFieldChange', {
        containerUuid,
        field: props.fieldAttributes,
        columnName,
        newValue: value
      })
    }
    /**
     * @param {string} operatorValue
     */
    const changeOperator = (operatorValue: string) => {
      const value = fieldValue.value
      if (
        !isEmptyValue(value) ||
        ['NULL', 'NOT_NULL'].includes(operatorValue)
      ) {
        handleChange(value)
      }
    }

    return {
      currentOperator,
      operatorsList,
      changeOperator
    }
  }
})
