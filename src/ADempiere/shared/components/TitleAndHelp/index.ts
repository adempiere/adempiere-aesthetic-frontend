import { DeviceType } from '@/ADempiere/modules/app/AppType'
import { defineComponent, computed } from '@vue/composition-api'
import Template from './template.vue'

export default defineComponent({
  name: 'TitleAndHelp',
  props: {
    name: {
      type: String,
      default: ''
    },
    help: {
      type: String,
      default: ''
    }
  },
  mixins: [Template],
  setup(props, { root }) {
    const title = computed<string>(() => {
      return props.name || root.$route.meta.title
    })

    const cssClassHelp = computed<string>(() => {
      if (
        (root.$store.state.app.device as DeviceType.Mobile) ===
        DeviceType.Mobile
      ) {
        return 'container-help-mobile'
      }
      return 'container-help'
    })

    return {
      cssClassHelp,
      title
    }
  }
})
