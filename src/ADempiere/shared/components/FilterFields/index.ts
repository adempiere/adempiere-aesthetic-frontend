import { PanelContextType } from '../../utils/DictionaryUtils/ContextMenuType'
import { IFieldDataExtendedUtils } from '../../utils/DictionaryUtils/type'
import { DeviceType, IAppState } from '@/ADempiere/modules/app/AppType'
import { isEmptyValue } from '../../utils/valueUtils'
import { Namespaces } from '../../utils/types'
import Template from './template.vue'
import {
  computed,
  ComputedRef,
  defineComponent,
  PropType,
  Ref,
  ref
} from '@vue/composition-api'

export default defineComponent({
  name: 'FilterFields',
  mixins: [Template],
  props: {
    containerUuid: {
      type: String,
      required: true
    },
    groupField: {
      type: String,
      default: ''
    },
    panelType: {
      type: String as PropType<PanelContextType>,
      default: 'window'
    }
  },
  setup(props, { root }) {
    const isAdvancedQuery: boolean = props.panelType === PanelContextType.Table
    const isMobile: ComputedRef<boolean> = computed(
      () => (root.$store.state.app as IAppState).device === DeviceType.Mobile
    )
    const fieldsListOptional: ComputedRef<IFieldDataExtendedUtils[]> = computed(
      () => {
        if (
          props.panelType === PanelContextType.Window &&
          !isEmptyValue(props.groupField)
        ) {
          // compare group fields to window
          return (root.$store.getters[
            Namespaces.Panel + '/' + 'getFieldsListNotMandatory'
          ]({
            containerUuid: props.containerUuid
          }) as IFieldDataExtendedUtils[]).filter(fieldItem => {
            return fieldItem.groupAssigned === props.groupField
          })
        }
        // get fields not mandatory
        return root.$store.getters[
          Namespaces.Panel + '/' + 'getFieldsListNotMandatory'
        ]({
          containerUuid: props.containerUuid
        }) as IFieldDataExtendedUtils[]
      }
    )

    const getFieldSelected: ComputedRef<string[]> = computed(() => {
      return fieldsListOptional.value
        .filter(fieldItem => {
          return fieldItem.isShowedFromUser
        })
        .map(itemField => {
          return itemField.columnName
        })
    })
    // fields optional showed
    const selectedFields: Ref<string[]> = ref(getFieldSelected.value)
    /**
     * @param {array} selectedValues
     */
    const addField = (selectedValues: string[]): void => {
      root.$store.dispatch(
        Namespaces.Panel + '/' + 'changeFieldShowedFromUser',
        {
          containerUuid: props.containerUuid,
          fieldsUser: selectedValues,
          show: true,
          groupField: props.groupField,
          isAdvancedQuery
        }
      )
      selectedFields.value = selectedValues
    }

    return {
      isMobile,
      addField,
      fieldsListOptional,
      getFieldSelected,
      selectedFields
    }
  }
})
