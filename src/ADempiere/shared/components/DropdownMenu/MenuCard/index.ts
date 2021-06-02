import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import { defineComponent, computed, ComputedRef } from '@vue/composition-api'
import Template from './template.vue'

export default defineComponent({
  props: {
    items: {
      type: Object,
      default: () => {
        return {}
      }
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  mixins: [Template],
  setup(props, { root }) {
    // Computed properties
    const mediumSize: ComputedRef<boolean> = computed<boolean>(() => {
      return props.size === 'medium'
    })

    const titleClass = computed<string>(() => {
      if (!isEmptyValue(props.items.meta.description)) {
        return ''
      }
      return mediumSize ? 'title-medium' : 'title-small'
    })

    const openItemMenu = (view: any) => {
      if (view.meta && view.meta.uuid && view.meta.type) {
        const { parentUuid, uuid: containerUuid, type: panelType } = view.meta

        if (panelType !== PanelContextType.Window) {
          root.$store.dispatch(Namespaces.Panel + '/' + 'setDefaultValues', {
            parentUuid,
            containerUuid,
            panelType,
            isNewRecord: false
          })
          if (['browser'].includes(panelType)) {
            root.$store.dispatch(
              Namespaces.BusinessData + '/' + 'deleteRecordContainer',
              {
                viewUuid: containerUuid
              }
            )
          }
        }
      }
    }

    const redirect = (item: {
      meta: { type: string }
      name: any
      children: any
    }) => {
      console.log(item)
      openItemMenu(item)
      let tabParent: number
      if (item.meta && item.meta.type === 'window') {
        tabParent = 0
      }
      root.$router.push(
        {
          name: item.name,
          query: {
            ...root.$route.query,
            tabParent: tabParent! as any
          },
          params: {
            ...root.$route.params,
            childs: item.children
          }
        },
        () => {}
      )
    }

    return {
      mediumSize,
      titleClass,
      openItemMenu,
      redirect
    }
  }
})
