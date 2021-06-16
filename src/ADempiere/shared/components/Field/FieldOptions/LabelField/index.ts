import { computed, ComputedRef, defineComponent } from '@vue/composition-api'
import Template from './template.vue'

export default defineComponent({
  mixins: [Template],
  props: {
    isMandatory: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const labelStyle: ComputedRef<string> = computed(() => {
      const displayStyle = props.isMobile ? 'display: flex;width: auto;' : 'display: block;'
      return displayStyle + ' margin-left: 3px;'
    })

    const iconStyle: ComputedRef<string> = computed(() => {
      if (props.isMobile) {
        return 'margin-left: 5px; margin-top: 7px;'
      }
      return 'margin-left: -5px; padding-bottom: 6px;'
    })

    return {
      labelStyle,
      iconStyle
    }
  }
})
