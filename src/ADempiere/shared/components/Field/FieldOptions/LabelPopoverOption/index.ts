import { IKeyValueObject } from '@/ADempiere/shared/utils/types'
import { computed, ComputedRef, defineComponent } from '@vue/composition-api'
import Template from './template.vue'

export default defineComponent({
  mixins: [Template],
  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const iconWrapperStyle: ComputedRef<IKeyValueObject> = computed(() => {
      if (props.isMobile) {
        return { 'margin-right': '6px' }
      }
      return {
        'margin-left': '5px',
        'margin-right': '13px'
      }
    })
    const textStyle: ComputedRef<IKeyValueObject | string> = computed(() => {
      if (!props.isMobile) {
        return ''
      }
      return { 'font-size': '130%', margin: '7px' }
    })

    return {
      iconWrapperStyle,
      textStyle
    }
  }
})
