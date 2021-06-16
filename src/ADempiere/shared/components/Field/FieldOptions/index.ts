import { DeviceType, IAppState } from '@/ADempiere/modules/app/AppType'
import { ContextMenuState } from '@/ADempiere/modules/window'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import {
  isEmptyValue,
  recursiveTreeSearch
} from '@/ADempiere/shared/utils/valueUtils'
import {
  computed,
  ComputedRef,
  defineComponent,
  Ref,
  ref,
  watch
} from '@vue/composition-api'
import VueI18n from 'vue-i18n'
import {
  calculatorOptionItem,
  documentStatusOptionItem,
  IOptionItem,
  optionsListAdvancedQuery,
  optionsListStandad,
  translateOptionItem,
  zoomInOptionItem
} from './fieldOptionsList'
import Template from './template.vue'
import LabelField from './LabelField'
import LabelPopoverOption from './LabelPopoverOption'

export default defineComponent({
  name: 'FieldOptions',
  mixins: [Template],
  props: {
    metadata: {
      type: Object as any
    }
  },
  components: {
    LabelField,
    LabelPopoverOption
  },
  setup(props, { root }) {
    const visibleForDesktop: Ref<boolean> = ref(false)
    const showPopoverPath: Ref<boolean> = ref(false)
    const triggerMenu: Ref<string> = ref('click')
    const optionColumnName = ref(root.$route.query.fieldColumnName)

    const isMobile: ComputedRef<boolean> = computed(() => {
      return (root.$store.state.app as IAppState).device === DeviceType.Mobile
    })

    const valueField = computed(() => {
      const { parentUuid, containerUuid, columnName } = props.metadata
      return root.$store.getters[
        Namespaces.FieldValue + '/' + 'getValueOfField'
      ]({
        parentUuid,
        containerUuid,
        columnName
      })
    })

    setTimeout(() => {
      if (
        isMobile.value &&
        optionColumnName.value === props.metadata.columnName
      ) {
        root.$store.commit(
          Namespaces.ContextMenu + '/' + 'changeShowRigthPanel',
          true
        )
        root.$store.dispatch(Namespaces.ContextMenu + '/' + 'setOptionField', {
          fieldAttributes: props.metadata,
          name: root.$route.query.typeAction,
          valueField: valueField.value
        })
      } else {
        showPopoverPath.value = true
      }
    }, 2000)

    const panelContextMenu: ComputedRef<boolean> = computed(() => {
      return (root.$store.state[Namespaces.ContextMenu] as ContextMenuState)
        .isShowRightPanel
    })

    const showPanelFieldOption: ComputedRef<boolean> = computed(() => {
      return (root.$store.state[Namespaces.ContextMenu] as ContextMenuState)
        .isShowOptionField
    })

    const labelStyle: ComputedRef<string> = computed(() => {
      if (props.metadata.name.length >= 25) {
        return '35'
      } else if (props.metadata.name.length >= 20) {
        return '50'
      }
      return '110'
    })

    const permissionRoutes = computed(() => {
      return root.$store.getters.permission_routes
    })

    const redirect = (data: { window: any }) => {
      const { window } = data
      const viewSearch = recursiveTreeSearch({
        treeData: permissionRoutes.value,
        attributeValue: window.uuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })

      if (viewSearch) {
        root.$router.push(
          {
            name: viewSearch.name,
            query: {
              action: 'advancedQuery',
              tabParent: 0 as any,
              [props.metadata.columnName]: valueField as any
            }
          },
          () => {}
        )
      } else {
        root.$message({
          type: 'error',
          showClose: true,
          message: root.$t('notifications.noRoleAccess').toString()
        })
      }
    }

    const handleCommand = (command: { name: VueI18n.TranslateResult }) => {
      root.$store.commit(
        Namespaces.ContextMenu + '/' + 'setRecordAccess',
        false
      )
      if (command.name === root.$t('table.ProcessActivity.zoomIn')) {
        if (!isEmptyValue(props.metadata.reference.zoomWindows)) {
          redirect({
            window: props.metadata.reference.zoomWindows[0]
          })
        }
        return
      }
      if (isMobile.value) {
        root.$store.commit(
          Namespaces.ContextMenu + '/' + 'changeShowRigthPanel',
          true
        )
      } else {
        visibleForDesktop.value = true
      }

      root.$store.commit(
        Namespaces.ContextMenu + '/' + 'changeShowPopoverField',
        true
      )
      root.$store.dispatch(Namespaces.ContextMenu + '/' + 'setOptionField', {
        ...command,
        fieldAttributes: props.metadata
      })
    }

    const isContextInfo: ComputedRef<boolean> = computed(() => {
      const field = props.metadata
      if (!field.isPanelWindow) {
        return false
      }

      return (
        Boolean(field.contextInfo && field.contextInfo.isActive) ||
        Boolean(field.reference && !isEmptyValue(field.reference.zoomWindows))
      )
    })

    const isDocuemntStatus: ComputedRef<boolean> = computed(() => {
      if (props.metadata.isPanelWindow && !props.metadata.isAdvancedQuery) {
        const { parentUuid, containerUuid, columnName } = props.metadata
        if (columnName === 'DocStatus') {
          const statusValue = root.$store.getters[
            Namespaces.FieldValue + '/' + 'getValueOfField'
          ]({
            parentUuid,
            containerUuid,
            columnName
          })
          // if (!root.isEmptyValue(root.$store.getters.getOrders)) {
          if (!isEmptyValue(statusValue)) {
            return true
          }
        }
      }
      return false
    })
    const optionsList = computed(() => {
      const menuOptions = []
      if (props.metadata.isNumericField) {
        menuOptions.push(calculatorOptionItem)
      }
      // infoOption, operatorOption
      if (props.metadata.isAdvancedQuery) {
        return menuOptions.concat(optionsListAdvancedQuery)
      }

      if (isContextInfo.value) {
        menuOptions.push(zoomInOptionItem)
      }
      if (props.metadata.isPanelWindow) {
        if (props.metadata.isTranslatedField) {
          menuOptions.push(translateOptionItem)
        }
        if (isDocuemntStatus.value) {
          menuOptions.push(documentStatusOptionItem)
        }
      }

      return menuOptions.concat(optionsListStandad)
    })

    const openOptionField: ComputedRef<boolean> = computed({
      get() {
        const option: IOptionItem | undefined = optionsList.value.find(
          option => {
            return root.$route.query.typeAction === option.name
          }
        )
        if (!isEmptyValue(root.$route.query) && option) {
          return true
        }
        return false
      },
      set(value: boolean) {
        if (!value) {
          showPopoverPath.value = false
          root.$router.push(
            {
              name: root.$route.name!,
              query: {
                ...root.$route.query,
                typeAction: '',
                fieldColumnName: ''
              }
            },
            () => {}
          )
        }
      }
    })

    const closePopover = () => {
      root.$router.push(
        {
          name: root.$route.name!,
          query: {
            ...root.$route.query,
            typeAction: '',
            fieldColumnName: ''
          }
        },
        () => {}
      )
    }
    const handleOpen = (key: any, keyPath: any) => {
      triggerMenu.value = 'hover'
    }
    const handleClose = (key: any, keyPath: any) => {
      triggerMenu.value = 'click'
    }
    const handleSelect = (key: VueI18n.TranslateResult, keyPath: any) => {
      if (key === root.$t('table.ProcessActivity.zoomIn')) {
        redirect({
          window: props.metadata.reference.zoomWindows[0]
        })
        return
      }
      if (isMobile.value) {
        root.$store.commit(
          Namespaces.ContextMenu + '/' + 'changeShowRigthPanel',
          true
        )
      } else {
        root.$store.commit(
          Namespaces.ContextMenu + '/' + 'changeShowOptionField',
          true
        )
        visibleForDesktop.value = true
        root.$router.push(
          {
            name: root.$route.name!,
            query: {
              ...root.$route.query,
              typeAction: key.toString(),
              fieldColumnName: props.metadata.columnName
            }
          },
          () => {}
        )
      }
      root.$store.commit(
        Namespaces.ContextMenu + '/' + 'changeShowPopoverField',
        true
      )
      const option: IOptionItem | undefined = optionsList.value.find(option => {
        return option.name === key
      })
      root.$store.dispatch(Namespaces.ContextMenu + '/' + 'setOptionField', {
        ...option,
        valueField: valueField.value,
        fieldAttributes: props.metadata
      })
      triggerMenu.value = 'hover'
    }

    watch(panelContextMenu, (newValue: boolean, oldValue: boolean) => {
      visibleForDesktop.value = false
    })

    watch(openOptionField, (newValue, oldValue) => {
      if (!newValue) {
        showPopoverPath.value = false
      }
    })

    const fieldAttributes = ref(props.metadata)

    return {
      isMobile,
      labelStyle,
      fieldAttributes,
      optionsList,
      closePopover,
      openOptionField,
      handleCommand,
      handleOpen,
      handleClose,
      handleSelect,
      isDocuemntStatus,
      visibleForDesktop,
      valueField,
      triggerMenu,
      showPanelFieldOption
    }
  }
})
